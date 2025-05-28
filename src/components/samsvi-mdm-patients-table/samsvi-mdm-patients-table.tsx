import { Component, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-patients-table',
  styleUrl: 'samsvi-mdm-patients-table.css',
  shadow: true,
})
export class SamsviMdmPatientsTable {
  @Prop() patients: any[] = [];
  @Prop() isMobileView: boolean = false;

  @State() openedMenuPatientId: string | null = null;

  handleActionClick(patientId: string) {
    this.openedMenuPatientId = this.openedMenuPatientId === patientId ? null : patientId;
  }

  handleDelete(patient: any) {
    const confirmed = window.confirm(`Are you sure you want to delete patient ${patient.name}?`);
    if (confirmed) {
      console.log('Deleting patient:', patient);
    }
    this.openedMenuPatientId = null;
  }

  handleViewDetails(patient: any) {
    const id = patient.id;
    const url = `/patient/${id}`;

    window.navigation?.navigate(url);
    this.openedMenuPatientId = null;
  }

  renderActions(patient: any) {
    const isOpen = this.openedMenuPatientId === patient.id;

    return (
      <div class="actions-container">
        <md-standard-icon-button onClick={() => this.handleActionClick(patient.id)}>
          <md-icon>more_horiz</md-icon>
        </md-standard-icon-button>
        {isOpen && (
          <div class="action-menu">
            <button onClick={() => this.handleViewDetails(patient)}>View Details</button>
            <button onClick={() => this.handleDelete(patient)}>Delete</button>
          </div>
        )}
      </div>
    );
  }

  renderMobileView() {
    return (
      <div class="patients-cards">
        {this.patients.map(patient => (
          <div class="patient-card" key={patient.id}>
            <div class="patient-header">
              <div class="patient-name">{patient.name}</div>
              <span class={`status-badge ${patient.status.toLowerCase()}`}>{patient.status}</span>
            </div>

            <div class="patient-details">
              <div class="detail-row">
                <span class="detail-label">Last appointment:</span>
                <span class="detail-value">{patient.lastAppointment}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Age:</span>
                <span class="detail-value">{patient.age}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date of birth:</span>
                <span class="detail-value">{patient.dateOfBirth}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Gender:</span>
                <span class="detail-value">{patient.gender}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Diagnosis:</span>
                <span class="detail-value">{patient.diagnosis}</span>
              </div>
            </div>

            <div class="patient-actions">{this.renderActions(patient)}</div>
          </div>
        ))}
      </div>
    );
  }

  renderDesktopView() {
    return (
      <table>
        <thead>
          <tr>
            <th>
              <md-checkbox></md-checkbox>
            </th>
            <th>Name</th>
            <th>Last appointment</th>
            <th>Age</th>
            <th>Date of birth</th>
            <th>Gender</th>
            <th>Diagnosis</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.patients.map(patient => (
            <tr key={patient.id}>
              <td>
                <md-checkbox></md-checkbox>
              </td>
              <td>{patient.name}</td>
              <td>{patient.lastAppointment}</td>
              <td>{patient.age}</td>
              <td>{patient.dateOfBirth}</td>
              <td>{patient.gender}</td>
              <td>{patient.diagnosis}</td>
              <td>
                <span class={`status-badge ${patient.status.toLowerCase()}`}>{patient.status}</span>
              </td>
              <td>{this.renderActions(patient)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <Host>
        <div class="patients-table">{this.isMobileView ? this.renderMobileView() : this.renderDesktopView()}</div>
      </Host>
    );
  }
}
