import { Component, Host, h, State, Method } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-record-modal',
  styleUrl: 'samsvi-mdm-record-modal.css',
  shadow: true,
})
export class SamsviMdmRecordModal {
  @State() open = false;
  @State() firstName = '';
  @State() lastName = '';
  @State() dateOfBirth = '';
  @State() gender = '';
  @State() insuranceNumber = '';
  @State() bloodType = '';
  @State() status = 'stable';
  @State() allergies = '';
  @State() notes = '';

  /**
   * Opens the modal dialog
   */
  @Method()
  async openModal() {
    this.open = true;
  }

  /**
   * Closes the modal dialog
   */
  @Method()
  async closeModal() {
    this.open = false;
  }

  private handleSubmit = (e: Event) => {
    e.preventDefault();

    // Create patient object from form data
    const patient = {
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      insuranceNumber: this.insuranceNumber,
      bloodType: this.bloodType,
      status: this.status,
      allergies: this.allergies,
      notes: this.notes,
    };

    // Here you would typically dispatch an event with the patient data
    // or call a service to save the patient
    console.log('Creating patient:', patient);

    // Close the modal after submission
    this.closeModal();

    // Reset form
    this.resetForm();
  };

  private resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.dateOfBirth = '';
    this.gender = '';
    this.insuranceNumber = '';
    this.bloodType = '';
    this.status = 'stable';
    this.allergies = '';
    this.notes = '';
  }

  render() {
    return (
      <Host>
        {this.open && (
          <div class="modal-backdrop">
            <md-dialog open={this.open} class="patient-dialog">
              <div slot="headline">Add New Record</div>

              <form onSubmit={this.handleSubmit}>
                <div slot="content" class="modal-content">
                  <div class="form-row">
                    <md-filled-text-field label="First Name" required value={this.firstName} onInput={(e: any) => (this.firstName = e.target.value)}></md-filled-text-field>

                    <md-filled-text-field label="Last Name" required value={this.lastName} onInput={(e: any) => (this.lastName = e.target.value)}></md-filled-text-field>
                  </div>

                  <div class="form-row">
                    <md-filled-text-field
                      label="Date of Birth"
                      type="date"
                      required
                      value={this.dateOfBirth}
                      onInput={(e: any) => (this.dateOfBirth = e.target.value)}
                    ></md-filled-text-field>

                    <md-filled-select label="Gender" required value={this.gender} onSelect={(e: any) => (this.gender = e.target.value)}>
                      <md-select-option value="male">Male</md-select-option>
                      <md-select-option value="female">Female</md-select-option>
                      <md-select-option value="other">Other</md-select-option>
                    </md-filled-select>
                  </div>

                  <md-filled-text-field
                    class="full-width"
                    label="Insurance Number"
                    required
                    value={this.insuranceNumber}
                    onInput={(e: any) => (this.insuranceNumber = e.target.value)}
                  ></md-filled-text-field>

                  <div class="form-row">
                    <md-filled-select label="Blood Type" value={this.bloodType} onSelect={(e: any) => (this.bloodType = e.target.value)}>
                      <md-select-option value="A+">A+</md-select-option>
                      <md-select-option value="A-">A-</md-select-option>
                      <md-select-option value="B+">B+</md-select-option>
                      <md-select-option value="B-">B-</md-select-option>
                      <md-select-option value="AB+">AB+</md-select-option>
                      <md-select-option value="AB-">AB-</md-select-option>
                      <md-select-option value="O+">O+</md-select-option>
                      <md-select-option value="O-">O-</md-select-option>
                    </md-filled-select>

                    <md-filled-select label="Status" value={this.status} onSelect={(e: any) => (this.status = e.target.value)}>
                      <md-select-option value="stable">Stable</md-select-option>
                      <md-select-option value="mild">Mild</md-select-option>
                      <md-select-option value="critical">Critical</md-select-option>
                    </md-filled-select>
                  </div>

                  <md-filled-text-field
                    class="full-width"
                    label="Allergies"
                    type="textarea"
                    rows={2}
                    value={this.allergies}
                    onInput={(e: any) => (this.allergies = e.target.value)}
                  ></md-filled-text-field>

                  <md-filled-text-field
                    class="full-width"
                    label="Medical Notes"
                    type="textarea"
                    rows={3}
                    value={this.notes}
                    onInput={(e: any) => (this.notes = e.target.value)}
                  ></md-filled-text-field>
                </div>

                <div slot="actions">
                  <md-filled-button onClick={() => this.closeModal()}>Cancel</md-filled-button>
                  <md-filled-button type="submit">Save Patient</md-filled-button>
                </div>
              </form>
            </md-dialog>
          </div>
        )}
      </Host>
    );
  }
}
