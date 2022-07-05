import { generatePdf } from 'tea-school';
import path from 'path';
import Debug from 'debug';
import dateTimeHelper from './dateTimeHelper';

const options = {
  htmlTemplatePath: path.resolve(__dirname, '../views/pdf-template.pug'),

  // Here you put an object according to https://github.com/sass/node-sass#options
  styleOptions: {
    file: path.resolve(__dirname, '../views/scss/pdf-template.scss'),
  },

  // Here you put an object according to https://pugjs.org/api/reference.html#options
  // You can add any additional key to be used as a variable in the template.
  htmlTemplateOptions: {},

  // Here you put an object according to https://github.com/GoogleChrome/puppeteer/blob/v1.18.1/docs/api.md#pagepdfoptions
  pdfOptions: {
    // Ignore `path` to get the PDF as buffer only
    // path: 'pdf-file.pdf',
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    date: true,
  },
};

async function makePdf(bufferString, school) {
  const utiltiyDebugger = Debug('app:utility:pdf-generator');
  Object.assign(options.htmlTemplateOptions, {
    buffer: bufferString.toString('base64'),
    datePrinted: dateTimeHelper.getDate(),
    schoolName: school.name,
    schoolAdminName: school.school_admin_name,
    schoolAddressDetails: school.address.address_details,
    schoolAreaName: school.address.area_name,
    schoolCity: school.address.city,
    schoolBranchName: school.branch_name,
    schoolPhoneNumber: school.phone_number,
    schoolDescription: school.description,
  });
  utiltiyDebugger(`Generating Pdf for ${school.name}`);
  return await generatePdf(options);
}

module.exports = {
  makePdf,
};
