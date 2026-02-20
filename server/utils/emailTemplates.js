
/**
 * Dovoc Email Templates
 * Standardized email styling for Dovoc Eco Life
 */

const getDovocEmailTemplate = (title, bodyContent) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Reset */
        body, p, h1, h2, h3, div, span, td {
            font-family: Arial, sans-serif;
            color: #2A363B;
            margin: 0;
            padding: 0;
        }
        body {
            background-color: #F2F1EB;
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        /* Container */
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #F2F1EB;
            padding-bottom: 40px;
        }
        .main-content {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            font-family: sans-serif;
            color: #2A363B;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        /* Header */
        .header {
            background-color: #557C55;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 0;
        }
        /* Body */
        .content-body {
            padding: 30px 40px;
            line-height: 1.6;
            font-size: 16px;
        }
        .content-body p {
            margin-bottom: 15px;
        }
        .btn {
            display: inline-block;
            background-color: #7E6363;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 20px;
        }
        /* Footer */
        .footer {
            background-color: #2A363B;
            padding: 20px;
            text-align: center;
            color: #A6CF98;
            font-size: 14px;
        }
        .footer p {
            color: #A6CF98;
            font-size: 12px;
        }
        /* Mobile */
        @media screen and (max-width: 600px) {
            .content-body {
                padding: 20px;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F2F1EB;">
    <div class="wrapper">
        <center>
            <table class="main-content" role="presentation">
                <!-- Header -->
                <tr>
                    <td class="header">
                        <h1>Dovoc Eco Life</h1>
                    </td>
                </tr>
                
                <!-- Body -->
                <tr>
                    <td class="content-body">
                        ${bodyContent}
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td class="footer">
                        <p>&copy; ${new Date().getFullYear()} Dovoc Eco Life. All rights reserved.</p>
                        <p>Sustainable. Organic. Handcrafted.</p>
                    </td>
                </tr>
            </table>
        </center>
    </div>
</body>
</html>
    `;
};

module.exports = { getDovocEmailTemplate };
