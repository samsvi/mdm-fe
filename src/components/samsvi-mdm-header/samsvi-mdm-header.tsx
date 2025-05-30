import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-header',
  styleUrl: 'samsvi-mdm-header.css',
  shadow: true,
})
export class SamsviMdmHeader {
  render() {
    return (
      <Host>
        <div class="header">
          <div class="page-title">
            <h1>Patients</h1>
            <p>View and manage your patients</p>
          </div>
        </div>
      </Host>
    );
  }
}
