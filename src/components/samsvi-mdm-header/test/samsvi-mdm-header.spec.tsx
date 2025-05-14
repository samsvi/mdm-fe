import { newSpecPage } from '@stencil/core/testing';
import { SamsviMdmHeader } from '../samsvi-mdm-header';

describe('samsvi-mdm-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SamsviMdmHeader],
      html: `<samsvi-mdm-header></samsvi-mdm-header>`,
    });
    expect(page.root).toEqualHtml(`
      <samsvi-mdm-header>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </samsvi-mdm-header>
    `);
  });
});
