import { Component, Host, h , State} from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-patient-list',
  styleUrl: 'samsvi-mdm-patient-list.css',
  shadow: true,
})
export class SamsviMdmPatientList {
  @State() patients = [
    { id: 1, name: 'Jozef Novak' },
    { id: 2, name: 'Janko Hrasko' },
  ];

  render() {
    return (
      <Host>
        <div class="card">
          <h2>Zoznam pacientov</h2>
          <ul>
            {this.patients.map((patient) => (
              <li>
                <md-outlined-button>{patient.name}</md-outlined-button>
              </li>
            ))}
          </ul>
        </div>
      </Host>
    );
  }
}
