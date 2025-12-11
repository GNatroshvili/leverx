import React from "react";

interface AdvancedSearchInputProps {
  advancedSearch: {
    name: string;
    email: string;
    phone: string;
    skype: string;
    building: string;
    room: string;
    department: string;
  };
  setAdvancedSearch: (params: any) => void;
  buildings: string[];
  departments: string[];
  handleAdvancedSearch: (e: React.FormEvent) => void;
}

const AdvancedSearchInput: React.FC<AdvancedSearchInputProps> = ({ advancedSearch, setAdvancedSearch, buildings, departments, handleAdvancedSearch }) => (
  <div className="search-input-and-button-wrapper" id="advanced-search-wrapper">
    <div className="search-input-wrapper">
      <p className="input-label">Name</p>
      <input
        type="text"
        className="advanced-search-input"
        id="advanced-name-input"
        placeholder="john smith"
        value={advancedSearch.name}
        onChange={(e) => setAdvancedSearch({ ...advancedSearch, name: e.target.value })}
      />
    </div>
    <div>
      <p className="input-label">Email</p>
      <input
        type="text"
        className="advanced-search-input"
        id="advanced-email-input"
        placeholder="john.smith@example.com"
        value={advancedSearch.email}
        onChange={(e) => setAdvancedSearch({ ...advancedSearch, email: e.target.value })}
      />
    </div>
    <div className="contact-input-wrapper">
      <div className="advanced-phone-wrapper">
        <p className="input-label">Phone</p>
        <input
          type="text"
          className="advanced-search-input"
          id="advanced-phone-input"
          placeholder="Phone Number"
          value={advancedSearch.phone}
          onChange={(e) => setAdvancedSearch({ ...advancedSearch, phone: e.target.value })}
        />
      </div>
      <div className="advanced-skype-wrapper">
        <p className="input-label">Skype</p>
        <input
          type="text"
          className="advanced-search-input"
          id="advanced-skype-input"
          placeholder="Skype ID"
          value={advancedSearch.skype}
          onChange={(e) => setAdvancedSearch({ ...advancedSearch, skype: e.target.value })}
        />
      </div>
    </div>
    <div className="Building-input-wrapper">
      <div>
        <p className="input-label">Building</p>
        <select
          className="advanced-search-input dropdown"
          id="advanced-building-input"
          value={advancedSearch.building}
          onChange={(e) => setAdvancedSearch({ ...advancedSearch, building: e.target.value })}
        >
          <option value="">Any</option>
          {buildings.map((building) => (
            <option key={building} value={building}>
              {building}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="input-label">Room</p>
        <input
          type="text"
          className="advanced-search-input"
          id="advanced-room-input"
          placeholder="303.1"
          value={advancedSearch.room}
          onChange={(e) => setAdvancedSearch({ ...advancedSearch, room: e.target.value })}
        />
      </div>
    </div>
    <div>
      <div>
        <p className="input-label">Department</p>
        <select
          className="advanced-search-input dropdown"
          id="advanced-department-input"
          value={advancedSearch.department}
          onChange={(e) => setAdvancedSearch({ ...advancedSearch, department: e.target.value })}
        >
          <option value="">Any</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div className="search-btn-wrapper">
      <button
        className="search-btn"
        id="advanced-search-submit-btn"
        onClick={handleAdvancedSearch}
      >
        Search
      </button>
    </div>
  </div>
);

export default AdvancedSearchInput;
