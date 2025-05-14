import { Component, h, Host, State, Listen } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-main-content',
  styleUrl: 'samsvi-mdm-main-content.css',
  shadow: true,
})
export class SamsviMdmMainContent {
  @State() patients = [
    {
      id: 1,
      name: 'Willy Ben Chen',
      lastAppointment: '10-04-2025',
      age: 27,
      dateOfBirth: '10-02-1998',
      gender: 'Male',
      diagnosis: 'Diabetes',
      status: 'Stable',
    },
    {
      id: 2,
      name: 'Emily Watford',
      lastAppointment: '09-04-2025',
      age: 37,
      dateOfBirth: '20-01-1988',
      gender: 'Female',
      diagnosis: 'Hypertension',
      status: 'Critical',
    },
    {
      id: 3,
      name: 'Nicholas Robertson',
      lastAppointment: '08-04-2025',
      age: 25,
      dateOfBirth: '24-06-1999',
      gender: 'Male',
      diagnosis: 'Anxiety Disorder',
      status: 'Stable',
    },
  ];

  @State() totalPatients = 352;
  @State() mildPatients = 180;
  @State() stablePatients = 150;
  @State() criticalPatients = 22;
  @State() searchQuery = '';
  @State() selectedStatus = 'all';
  @State() isMobileView = false;

  componentWillLoad() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth < 768;
  }

  @Listen('statusFilterChanged')
  statusFilterChangedHandler(event: CustomEvent) {
    this.selectedStatus = event.detail;
  }

  handleSearchInput(event) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  get filteredPatients() {
    return this.patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(this.searchQuery) || patient.diagnosis.toLowerCase().includes(this.searchQuery);

      const matchesStatus = this.selectedStatus === 'all' || patient.status.toLowerCase() === this.selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }

  render() {
    return (
      <Host>
        <div class="main-content">
          <samsvi-mdm-header></samsvi-mdm-header>

          <samsvi-mdm-stats
            totalPatients={this.totalPatients}
            mildPatients={this.mildPatients}
            stablePatients={this.stablePatients}
            criticalPatients={this.criticalPatients}
            isMobileView={this.isMobileView}
          ></samsvi-mdm-stats>

          <samsvi-mdm-table-controls onInput={e => this.handleSearchInput(e)} selectedStatus={this.selectedStatus}></samsvi-mdm-table-controls>

          <samsvi-mdm-patients-table patients={this.filteredPatients} isMobileView={this.isMobileView}></samsvi-mdm-patients-table>
        </div>
      </Host>
    );
  }
}
