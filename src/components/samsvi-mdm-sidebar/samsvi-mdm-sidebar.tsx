import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-sidebar',
  styleUrl: 'samsvi-mdm-sidebar.css',
  shadow: true,
})
export class SamsviMdmSidebar {
  render() {
    return (
      <Host>
        <div class="sidebar">
          <div class="sidebar-content">
            <div class="logo">
              <md-icon>medical_services</md-icon>
              <span>WacCare</span>
            </div>

            <div class="menu-items">
              <div class="menu-item">
                <md-icon>dashboard</md-icon>
                <span>Dashboard</span>
              </div>
              <div class="menu-item">
                <md-icon>event</md-icon>
                <span>Appointment</span>
              </div>
              <div class="menu-item active">
                <md-icon>person</md-icon>
                <span>Patient</span>
              </div>
              <div class="menu-item">
                <md-icon>bar_chart</md-icon>
                <span>Report</span>
              </div>
              <div class="menu-item">
                <md-icon>local_hospital</md-icon>
                <span>Clinic</span>
              </div>
            </div>

            <div class="bottom-menu">
              <div class="menu-item">
                <md-icon>help</md-icon>
                <span>Help Center</span>
              </div>
              <div class="menu-item">
                <md-icon>settings</md-icon>
                <span>Settings</span>
              </div>
            </div>
          </div>

          <div class="sidebar-toggle">
            <md-icon>menu</md-icon>
          </div>
        </div>
      </Host>
    );
  }
}
