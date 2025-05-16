import { Component, Host, h, Prop, Event, EventEmitter, Element } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-table-controls',
  styleUrl: 'samsvi-mdm-table-controls.css',
  shadow: true,
})
export class SamsviMdmTableControls {
  @Prop() selectedStatus: string = 'all';
  @Element() el: HTMLElement;
  @Event() statusFilterChanged: EventEmitter<string>;

  handleStatusChange(event) {
    this.statusFilterChanged.emit(event.target.value);
  }

  handleAddPatient = () => {
    const modalElement = document.querySelector('samsvi-mdm-patient-modal') as HTMLElement & { openModal: () => Promise<void> };
    if (modalElement) {
      modalElement.openModal();
    }
  };

  render() {
    return (
      <Host>
        <div class="table-controls">
          <md-filled-text-field placeholder="Search patient..." type="search" class="patient-search">
            <md-icon slot="leading">search</md-icon>
          </md-filled-text-field>

          <div class="table-actions">
            <md-filled-select class="status-select" value={this.selectedStatus} onSelect={e => this.handleStatusChange(e)}>
              <md-select-option value="all" selected={this.selectedStatus === 'all'}>
                All Status
              </md-select-option>
              <md-select-option value="stable" selected={this.selectedStatus === 'stable'}>
                Stable
              </md-select-option>
              <md-select-option value="mild" selected={this.selectedStatus === 'mild'}>
                Mild
              </md-select-option>
              <md-select-option value="critical" selected={this.selectedStatus === 'critical'}>
                Critical
              </md-select-option>
            </md-filled-select>

            <md-filled-button class="add-patient-button" onClick={this.handleAddPatient}>
              <md-icon slot="icon">add</md-icon>
              Add patient
            </md-filled-button>
          </div>
        </div>
      </Host>
    );
  }
}
