import React, { useEffect, useState } from 'react';
import { User, MapPin, Phone, Hospital, Search, Mail } from 'lucide-react';
import api from '../api';

const DoctorSupport = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-main mb-2">Dermatologist Support</h1>
          <p className="text-muted">Find and contact specialized dermatologists for professional consultation.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search doctors..." 
            style={{ paddingLeft: '2.5rem', width: '250px' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-muted font-medium">Loading specialists...</div>
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="card p-6 border transition-all hover:border-primary">
              <div className="flex items-start gap-4 mb-4">
                <div className="avatar" style={{width: 50, height: 50, fontSize: '1.25rem', backgroundColor: 'var(--accent-blue)'}}>
                  {doctor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{doctor.name}</h3>
                  <div className="text-primary font-medium text-sm">{doctor.specialty}</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex items-center gap-3 text-muted text-sm mb-2">
                  <Hospital size={16} className="text-main" />
                  <span>{doctor.hospital}</span>
                </div>
                <div className="flex items-center gap-3 text-muted text-sm mb-2">
                   <MapPin size={16} className="text-accent-blue" />
                   <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted text-sm mb-2">
                   <Phone size={16} className="text-success" />
                   <span>{doctor.contact}</span>
                </div>
                <div className="flex items-center gap-3 text-muted text-sm">
                   <Mail size={16} />
                   <span>{doctor.email}</span>
                </div>
              </div>
              <button className="btn btn-outline w-full mt-6 py-2 pb-2 pt-2 text-sm justify-center font-semibold">
                Request Appointment
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 text-muted card">No doctors found matching your search.</div>
      )}
    </div>
  );
};

export default DoctorSupport;
