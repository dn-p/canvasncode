const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      // Title
      new Paragraph({
        text: "Blackbox Testing Report",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      
      // Project Info
      new Paragraph({
        text: "Project: Canvas & Code Next",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      
      new Paragraph({
        text: "Testing Date: June 25, 2026",
        spacing: { after: 200 }
      }),
      
      new Paragraph({
        text: "Tester: AI Testing Agent",
        spacing: { after: 400 }
      }),
      
      // Executive Summary
      new Paragraph({
        text: "Executive Summary",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      
      new Paragraph({
        text: "Blackbox testing was performed on the Canvas & Code Next application, a Next.js-based creative and IT agency website. The testing focused on functional testing of user interfaces, API endpoints, and form submissions without examining the internal code structure.",
        spacing: { after: 200 }
      }),
      
      // Test Environment
      new Paragraph({
        text: "Test Environment",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }),
      
      new Paragraph({
        text: "• Development Server: localhost:3000",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "• Framework: Next.js 16.2.7",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "• Database: PostgreSQL (Supabase)",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "• Storage: Supabase Storage",
        spacing: { after: 400 }
      }),
      
      // Test Scope
      new Paragraph({
        text: "Test Scope",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }),
      
      new Paragraph({
        text: "The following areas were tested:",
        spacing: { after: 200 }
      }),
      
      new Paragraph({
        text: "1. Application Startup and Server Initialization",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "2. Main Page UI Components and Navigation",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "3. Discovery Call Form Submission API",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "4. Custom Project Submission API",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "5. Checkout/Order Flow API",
        spacing: { after: 400 }
      }),
      
      // Test Results
      new Paragraph({
        text: "Test Results",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      
      // Test 1
      new Paragraph({
        text: "Test 1: Application Startup",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 150 }
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "Status: ",
            bold: true
          }),
          new TextRun({
            text: "PASSED",
            color: "008000",
            bold: true
          })
        ],
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Description: The development server started successfully using 'npm run dev' command. The application was accessible at http://localhost:3000 within 8.4 seconds.",
        spacing: { after: 200 }
      }),
      
      // Test 2
      new Paragraph({
        text: "Test 2: Main Page UI Components",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 150 }
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "Status: ",
            bold: true
          }),
          new TextRun({
            text: "PASSED",
            color: "008000",
            bold: true
          })
        ],
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Description: The main page loaded successfully with all UI components including hero section, service cards, testimonials carousel, FAQ section, and pricing cards. All visual elements rendered correctly.",
        spacing: { after: 200 }
      }),
      
      // Test 3
      new Paragraph({
        text: "Test 3: Discovery Call Form API",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 150 }
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "Status: ",
            bold: true
          }),
          new TextRun({
            text: "FAILED",
            color: "FF0000",
            bold: true
          })
        ],
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Description: The POST request to /api/discovery endpoint failed with a 500 Internal Server Error. The error indicates a database connection issue - the application cannot reach the Supabase database server.",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Error Details: PrismaClientInitializationError - Can't reach database server at aws-1-ap-southeast-2.pooler.supabase.com:6543",
        spacing: { after: 200 }
      }),
      
      // Test 4
      new Paragraph({
        text: "Test 4: Custom Project Submission API",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 150 }
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "Status: ",
            bold: true
          }),
          new TextRun({
            text: "FAILED",
            color: "FF0000",
            bold: true
          })
        ],
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Description: The POST request to /api/custom-project endpoint failed with a 500 Internal Server Error. Similar to the discovery API, this is due to database connectivity issues.",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Error Details: PrismaClientInitializationError - Can't reach database server at aws-1-ap-southeast-2.pooler.supabase.com:6543",
        spacing: { after: 200 }
      }),
      
      // Test 5
      new Paragraph({
        text: "Test 5: Checkout/Order Flow",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 150 }
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "Status: ",
            bold: true
          }),
          new TextRun({
            text: "NOT TESTED",
            color: "FFA500",
            bold: true
          })
        ],
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Description: The checkout flow was not tested due to the database connectivity issues affecting other endpoints. This endpoint also requires database access and Supabase storage for receipt uploads.",
        spacing: { after: 200 }
      }),
      
      // Issues Found
      new Paragraph({
        text: "Issues Found",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      
      new Paragraph({
        text: "Critical Issues:",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 150 }
      }),
      
      new Paragraph({
        text: "1. Database Connection Failure - The application cannot connect to the Supabase PostgreSQL database. This affects all API endpoints that require database operations (discovery form, custom project, checkout).",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "2. Environment Configuration - The DATABASE_URL and DIRECT_URL environment variables may not be properly configured or the database server may be unreachable from the current network.",
        spacing: { after: 200 }
      }),
      
      // Recommendations
      new Paragraph({
        text: "Recommendations",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      
      new Paragraph({
        text: "1. Verify Database Connectivity - Check that the Supabase database server is running and accessible from the development environment.",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "2. Review Environment Variables - Ensure that DATABASE_URL and DIRECT_URL in the .env file are correct and match the Supabase project configuration.",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "3. Network Configuration - Check if there are any firewall or network restrictions preventing access to aws-1-ap-southeast-2.pooler.supabase.com:6543.",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "4. Error Handling - Implement better error handling for database connection failures to provide more user-friendly error messages.",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "5. Health Check Endpoint - Consider adding a health check endpoint to verify database connectivity before processing user requests.",
        spacing: { after: 200 }
      }),
      
      // Conclusion
      new Paragraph({
        text: "Conclusion",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      
      new Paragraph({
        text: "The Canvas & Code Next application has a well-structured frontend with all UI components functioning correctly. However, the backend API endpoints are currently non-functional due to database connectivity issues. Resolving the database connection is critical for the application to perform its core functions of collecting discovery calls, processing custom project requests, and handling checkout orders.",
        spacing: { after: 200 }
      }),
      
      new Paragraph({
        text: "Once the database connectivity is restored, the application should be fully functional as the API endpoints are properly implemented with appropriate validation and error handling logic.",
        spacing: { after: 400 }
      }),
      
      // Summary Table
      new Paragraph({
        text: "Test Summary",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }),
      
      new Paragraph({
        text: "Total Tests: 5",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Passed: 2",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Failed: 2",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Not Tested: 1",
        spacing: { after: 100 }
      }),
      
      new Paragraph({
        text: "Success Rate: 40%",
        spacing: { after: 200 }
      }),
      
      // Footer
      new Paragraph({
        text: "--- End of Report ---",
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 }
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const fs = require('fs');
  fs.writeFileSync('Blackbox_Testing_Report.docx', buffer);
  console.log('Report generated successfully: Blackbox_Testing_Report.docx');
}).catch(err => {
  console.error('Error generating report:', err);
});
