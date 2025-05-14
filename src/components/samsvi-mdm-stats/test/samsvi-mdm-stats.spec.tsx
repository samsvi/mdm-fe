import { newSpecPage } from '@stencil/core/testing';
import { SamsviMdmStats } from '../samsvi-mdm-stats';

describe('samsvi-mdm-stats', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SamsviMdmStats],
      html: `<samsvi-mdm-stats></samsvi-mdm-stats>`,
    });
    expect(page.root).toEqualHtml(`
      <samsvi-mdm-stats>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </samsvi-mdm-stats>
    `);
  });
});
