import dateTimeHelper from './dateTimeHelper';
import { Logger } from '@nestjs/common';
import * as pug from 'pug';
// import * as PDFDocument from 'pdfkit';
// import { join } from 'path';
// import { readFileSync } from 'fs';
import * as pdf from 'html-pdf';
import { join } from 'path';
import { writeFileSync } from 'fs';

const logger: Logger = new Logger('PDF GENERATOR');

async function makePdf(bufferString, school) {
  const data = pug.renderFile(
    join(
      '/home/faisal/work/nest/kiddiecove-backend-nest/src/views',
      'pdf-template.pug',
    ),
    {
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
    },
  );
  return data;
}

// async function makePdf(bufferString, school) {
//   logger.log('Generating PDF');
//   try {
//     const pdfBuffer: Buffer = await new Promise((resolve) => {
//       const doc = new PDFDocument({
//         size: 'A4',
//         bufferPages: true,
//       });

//       // const data = readFileSync(join(__dirname, '../images/logo.png'));
//       // doc.image(data);

//       doc
//         .fontSize(30)
//         .fillColor('blue')
//         .font('Courier-Bold')
//         .text('KiddieCove', {
//           align: 'center',
//         });

//       doc.fillColor('blue').fontSize(14).font('Times-Bold').text('Date: ', {});
//       doc
//         .fillColor('black')
//         .fontSize(12)
//         .font('Times-Roman')
//         .text(dateTimeHelper.getDate(), {});
//       doc.fillColor('black').moveDown();
//       doc
//         .fillColor('blue')
//         .fontSize(14)
//         .font('Times-Bold')
//         .text('School Name: ', {});
//       doc.fillColor('black').fontSize(12).font('Times-Roman').text(school.name);
//       doc.moveDown();
//       doc
//         .fillColor('blue')
//         .fontSize(14)
//         .font('Times-Bold')
//         .text('School Admin Name: ');
//       doc
//         .fillColor('black')
//         .fontSize(12)
//         .font('Times-Roman')
//         .text(school.school_admin_name);
//       doc.moveDown();
//       doc
//         .fillColor('blue')
//         .fontSize(14)
//         .font('Times-Bold')
//         .text('School Address: ');
//       doc
//         .fillColor('black')
//         .fontSize(12)
//         .font('Times-Roman')
//         .text(school.address.address_details);
//       doc.moveDown();
//       doc
//         .fillColor('blue')
//         .fontSize(14)
//         .font('Times-Bold')
//         .text('School Area: ');
//       doc
//         .fillColor('black')
//         .fontSize(12)
//         .font('Times-Roman')
//         .text(school.address.area_name);
//       doc.moveDown();
//       doc.fillColor('blue').fontSize(14).font('Times-Bold').text('City: ');
//       doc
//         .fillColor('black')
//         .fontSize(12)
//         .font('Times-Roman')
//         .text(school.address.city);
//       doc.moveDown();
//       doc.fillColor('blue').fontSize(14).font('Times-Bold').text('Branch: ');
//       doc
//         .fillColor('black')
//         .fontSize(12)
//         .font('Times-Roman')
//         .text(school.branch_name);
//       doc.moveDown();
//       doc
//         .fillColor('blue')
//         .fontSize(14)
//         .font('Times-Bold')
//         .text('School Phone Number: ');
//       doc
//         .fillColor('black')
//         .fontSize(12)
//         .font('Times-Roman')
//         .text(school.phone_number);
//       doc.moveDown();
//       doc.fillColor('black').text(school.description);

//       doc.image(bufferString.toString('base64'), {
//         fit: [300, 350],
//         align: 'center',
//         valign: 'center',
//       });

//       doc.rect(5, 5, 585, 830).stroke();

//       doc.end();

//       const buffer = [];
//       doc.on('data', buffer.push.bind(buffer));
//       doc.on('end', () => {
//         const data = Buffer.concat(buffer);
//         resolve(data);
//       });
//     });
//     return pdfBuffer;
//   } catch (e) {
//     console.log(e.message);
//   }

//   logger.log('PDF Generated');
// }

export default makePdf;
