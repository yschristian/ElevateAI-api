const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

// Hard-coded certificate data
const hardcodedCertificateData = {
    firstName: 'John',
    lastName: 'Doe',
    course: {
        title: 'Advanced Web Development'
    },
    companyName: 'Cyberware Solution',
    completionDate: 'December 3, 2024',
    certificateCode: 'CERT-2024-001'
};

// Function to create the PDF and return as a Buffer
const createPDF = (certificateData = hardcodedCertificateData) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 20, left: 50, right: 50 },
        });

        // Create an array to store the PDF chunks
        const chunks = [];
        doc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            resolve(pdfBuffer); // Return the PDF as a Buffer
        });

        // Add a light background color for the page
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F5F5F5');

        // Add the logo on the left side with a larger size
        const logoPath = path.join(__dirname, '../images/cyberwarelogo.png');
        if (fs.existsSync(logoPath)) {
            console.log("Logo file exists:", logoPath);
            doc.image(logoPath, 50, 40, { width: 100, height: 100 }); // Increased size
        }

        // Add a double-lined border
        const outerMargin = 20;
        const innerMargin = 25;

        doc.rect(outerMargin, outerMargin, doc.page.width - 2 * outerMargin, doc.page.height - 2 * outerMargin).stroke('#000000'); // Outer border
        doc.rect(innerMargin, innerMargin, doc.page.width - 2 * innerMargin, doc.page.height - 2 * innerMargin).stroke('#00BFFF'); // Inner border

        // Add the title
        doc.moveDown(3);
        doc.fontSize(28).font('Helvetica-Bold').fillColor('#333333').text('Certificate of Completion', {
            align: 'center',
            lineGap: 10,
        });

        doc.moveDown(2);

        // Add the user name and course details
        doc.fontSize(18).font('Helvetica').fillColor('#000000').text(`This is to certify that`, { align: 'center' })
            .moveDown(0.5)
            .fontSize(20).font('Helvetica-Bold').text(`${certificateData.firstName} ${certificateData.lastName}`, { align: 'center' })
            .moveDown(0.5)
            .fontSize(18).font('Helvetica').text(`has successfully completed the course`, { align: 'center' })
            .moveDown(0.5)
            .fontSize(20).font('Helvetica-Bold').text(`${certificateData.course.title}`, { align: 'center' });

        doc.moveDown(3);

        // Add the company name and completion date
        doc.fontSize(16).font('Helvetica').fillColor('#555555').text(`Issued by: ${certificateData.companyName}`, { align: 'center' })
            .moveDown(1)
            .text(`Date: ${certificateData.completionDate}`, { align: 'center' });

        // Add the certificate code
        doc.moveDown(1);
        doc.fontSize(14).font('Helvetica-Oblique').fillColor('#888888').text(`Certificate Code: ${certificateData.certificateCode}`, {
            align: 'center',
        });

        doc.moveDown(5);

        // Add a signature line
        doc.fontSize(16).fillColor('#333333').text("Authorized Signature", {
            align: "left",
            indent: 50,
        });

        // Draw the signature line
        doc.moveDown(0.5);
        doc.lineWidth(1).moveTo(50, doc.y).lineTo(200, doc.y).stroke();

        // Finalize the PDF and end the stream
        doc.end();
    });
};

// Optional: If you want to generate the PDF and save it
const generateCertificate = async () => {
    try {
        const pdfBuffer = await createPDF();
        fs.writeFileSync('certificate111.pdf', pdfBuffer);
        console.log('Certificate PDF generated successfully!');
    } catch (error) {
        console.error('Error generating certificate:', error);
    }
};

// Uncomment the line below to generate the PDF when this script is run
generateCertificate();
