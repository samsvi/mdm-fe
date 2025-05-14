import { newSpecPage } from '@stencil/core/testing';
import { SamsviMdmSidebar } from '../samsvi-mdm-sidebar';

describe('samsvi-mdm-sidebar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SamsviMdmSidebar],
      html: `<samsvi-mdm-sidebar></samsvi-mdm-sidebar>`,
    });
    expect(page.root).toEqualHtml(`
      <samsvi-mdm-sidebar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </samsvi-mdm-sidebar>
    `);
  });
});
