import React from 'react';

const SettingsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      
      <div className="card bg-base-100 shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input 
              type="text" 
              placeholder="Name" 
              className="input input-bordered" 
              value="John Mwangi"
              readOnly
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input 
              type="email" 
              placeholder="Email" 
              className="input input-bordered" 
              value="john.mwangi@email.com"
              readOnly
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input 
              type="tel" 
              placeholder="Phone" 
              className="input input-bordered" 
              value="+254 712 345 678"
              readOnly
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input 
              type="text" 
              placeholder="Location" 
              className="input input-bordered" 
              value="Nairobi, Kenya"
              readOnly
            />
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Professional Settings</h3>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Hourly Rate</span>
            </label>
            <input 
              type="text" 
              placeholder="Hourly Rate" 
              className="input input-bordered" 
              value="KSh 600/hr"
              readOnly
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Availability</span>
            </label>
            <select className="select select-bordered" disabled>
              <option>Available immediately</option>
              <option>Available in 1 week</option>
              <option>Available in 2 weeks</option>
              <option>Not available</option>
            </select>
          </div>
          
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Receive job notifications</span>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                defaultChecked 
                disabled
              />
            </label>
          </div>
          
          <button className="btn btn-primary" disabled>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;