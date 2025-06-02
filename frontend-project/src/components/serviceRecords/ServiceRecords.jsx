
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const ServiceRecords = () => {
  const { user, token } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    serviceCode: '',
    amountPaid: '',
  });
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [billData, setBillData] = useState(null);

  const { plateNumber, serviceCode, amountPaid } = formData;

  const fetchData = async () => {
    if (!token) {
      setError('Please log in to view service records');
      setLoading(false);
      return;
    }

    try {
      const [recordsRes, carsRes, servicesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/service-records', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/cars', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/services', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRecords(recordsRes.data);
      setCars(carsRes.data);
      setServices(servicesRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.msg || 'Failed to load data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setError('Please log in to view service records');
      setLoading(false);
    }
  }, [token]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');

    if (e.target.name === 'serviceCode') {
      const selectedService = services.find((service) => service.ServiceCode === e.target.value);
      if (selectedService) {
        setFormData({
          ...formData,
          serviceCode: e.target.value,
          amountPaid: selectedService.ServicePrice,
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      plateNumber: '',
      serviceCode: '',
      amountPaid: '',
    });
    setEditMode(false);
    setCurrentRecord(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!plateNumber || !serviceCode || !amountPaid) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!token) {
      setFormError('Please log in to perform this action');
      return;
    }

    try {
      if (editMode && currentRecord) {
        await axios.put(
          `http://localhost:5000/api/service-records/${currentRecord.RecordNumber}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Service record updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/service-records', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Service record added successfully');
      }

      resetForm();
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      console.error('Error with service record:', err);
      setFormError(err.response?.data?.msg || 'Failed to process service record');
    }
  };

  const onEdit = (record) => {
    setFormData({
      plateNumber: record.PlateNumber,
      serviceCode: record.ServiceCode,
      amountPaid: record.AmountPaid,
    });
    setEditMode(true);
    setCurrentRecord(record);
  };

  const onDelete = async (recordNumber) => {
    if (!token) {
      setError('Please log in to perform this action');
      return;
    }

    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/service-records/${recordNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Service record deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchData();
      } catch (err) {
        console.error('Error deleting record:', err);
        setError(err.response?.data?.msg || 'Failed to delete record');
      }
    }
  };

  const onGenerateBill = async (recordNumber) => {
    if (!token) {
      setError('Please log in to view the bill');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/reports/bill/${recordNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBillData(response.data);
      setIsBillModalOpen(true);
    } catch (err) {
      console.error('Error generating bill:', err);
      setError(err.response?.data?.msg || 'Failed to generate bill');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#fdeca6]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff7ff2]"></div>
      </div>
    );
  }

  return (
    <div className="py-6 bg-[#fdeca6]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Service Records Management</h1>

      {/* Add/Edit Service Record Form */}
      <div className="bg-[#fdeca6] rounded-lg shadow-md p-6 mb-8 border border-[#ff7ff2]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editMode ? 'Edit Service Record' : 'Add New Service Record'}
        </h2>

        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}

        {success && (
          <div className="bg-[#fdeca6] border border-[#ff7ff2] text-gray-800 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-4">
              <label htmlFor="plateNumber" className="block text-gray-800 text-sm font-medium mb-2">
                Car Plate Number
              </label>
              <select
                id="plateNumber"
                name="plateNumber"
                value={plateNumber}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7ff2] focus:border-[#ff7ff2]"
              >
                <option value="">Select a car</option>
                {cars.map((car) => (
                  <option key={car.PlateNumber} value={car.PlateNumber}>
                    {car.PlateNumber} - {car.Model}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="serviceCode" className="block text-gray-800 text-sm font-medium mb-2">
                Service
              </label>
              <select
                id="serviceCode"
                name="serviceCode"
                value={serviceCode}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7ff2] focus:border-[#ff7ff2]"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.ServiceCode} value={service.ServiceCode}>
                    {service.ServiceName} - {Number(service.ServicePrice).toLocaleString()} RWF
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="amountPaid" className="block text-gray-800 text-sm font-medium mb-2">
                Amount Paid (RWF)
              </label>
              <input
                type="number"
                id="amountPaid"
                name="amountPaid"
                value={amountPaid}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7ff2] focus:border-[#ff7ff2]"
                placeholder="e.g. 150000"
              />
            </div>
          </div>

          <div className="mt-2 flex space-x-2">
            <button
              type="submit"
              className="bg-[#ff7ff2] hover:bg-[#e66fd8] text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              {editMode ? 'Update Record' : 'Add Record'}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Service Records List */}
      <div className="bg-[#fdeca6] rounded-lg shadow-md p-6 border border-[#ff7ff2]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Records List</h2>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[#fdeca6] rounded-lg">
            <p className="text-gray-800 text-lg mb-4">No service records found.</p>
            <p className="text-gray-700 text-sm max-w-md text-center">
              Add your first service record using the form above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#fdeca6]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Record #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Received By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#fdeca6] divide-y divide-gray-200">
                {records.map((record, index) => (
                  <tr key={record.RecordNumber} className={index % 2 === 0 ? 'bg-[#fdeca6]' : 'bg-[#fff5c3]'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {record.RecordNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#ff7ff2]">
                      {record.PlateNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {record.ServiceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {Number(record.AmountPaid).toLocaleString()} RWF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(record.PaymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.ReceivedByUser}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => onEdit(record)}
                        className="text-[#ff7ff2] hover:text-[#e66fd8] transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(record.RecordNumber)}
                        className="text-[#ff7ff2] hover:text-[#e66fd8] transition duration-300"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => onGenerateBill(record.RecordNumber)}
                        className="text-[#ff7ff2] hover:text-[#e66fd8] transition duration-300"
                      >
                        View Bill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bill Modal */}
      {isBillModalOpen && billData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#fdeca6] rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Bill Details</h2>
              <div className="space-x-2">
                <button
                  onClick={handlePrint}
                  className="bg-[#ff7ff2] hover:bg-[#e66fd8] text-white font-medium py-1 px-3 rounded-md"
                >
                  Print
                </button>
                <button
                  onClick={() => setIsBillModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="text-gray-800">
              <p><strong>Bill Number:</strong> {billData.billNumber}</p>
              <p><strong>Date:</strong> {billData.date}</p>
              <h3 className="mt-4 font-semibold">Car Details</h3>
              <p><strong>Plate Number:</strong> {billData.car.plateNumber}</p>
              <p><strong>Type:</strong> {billData.car.type}</p>
              <p><strong>Model:</strong> {billData.car.model}</p>
              <p><strong>Driver Phone:</strong> {billData.car.driverPhone}</p>
              <p><strong>Mechanic Name:</strong> {billData.car.mechanicName}</p>
              <h3 className="mt-4 font-semibold">Service Details</h3>
              <p><strong>Service Name:</strong> {billData.service.name}</p>
              <p><strong>Service Price:</strong> {billData.service.price.toLocaleString()} RWF</p>
              <h3 className="mt-4 font-semibold">Payment Details</h3>
              <p><strong>Amount Paid:</strong> {billData.payment.amountPaid.toLocaleString()} RWF</p>
              <p><strong>Received By:</strong> {billData.payment.receivedBy}</p>
              <p><strong>Balance:</strong> {billData.balance.toLocaleString()} RWF</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Content */}
      {billData && (
        <div className="hidden print:block p-6 bg-[#fdeca6]">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Bill #{billData.billNumber}</h1>
          <p className="text-gray-800"><strong>Date:</strong> {billData.date}</p>
          <h2 className="text-lg font-semibold text-gray-800 mt-4">Car Details</h2>
          <p className="text-gray-800"><strong>Plate Number:</strong> {billData.car.plateNumber}</p>
          <p className="text-gray-800"><strong>Type:</strong> {billData.car.type}</p>
          <p className="text-gray-800"><strong>Model:</strong> {billData.car.model}</p>
          <p className="text-gray-800"><strong>Driver Phone:</strong> {billData.car.driverPhone}</p>
          <p className="text-gray-800"><strong>Mechanic Name:</strong> {billData.car.mechanicName}</p>
          <h2 className="text-lg font-semibold text-gray-800 mt-4">Service Details</h2>
          <p className="text-gray-800"><strong>Service Name:</strong> {billData.service.name}</p>
          <p className="text-gray-800"><strong>Service Price:</strong> {billData.service.price.toLocaleString()} RWF</p>
          <h2 className="text-lg font-semibold text-gray-800 mt-4">Payment Details</h2>
          <p className="text-gray-800"><strong>Amount Paid:</strong> {billData.payment.amountPaid.toLocaleString()} RWF</p>
          <p className="text-gray-800"><strong>Received By:</strong> {billData.payment.receivedBy}</p>
          <p className="text-gray-800"><strong>Balance:</strong> {billData.balance.toLocaleString()} RWF</p>
        </div>
      )}
    </div>
  );
};

export default ServiceRecords;