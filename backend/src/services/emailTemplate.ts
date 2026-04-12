export const hydrationEmailTemplate = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Hydration Station</h2>

    <p>Hello {{name}},</p>

    <p>
      Here is this month's <strong>Hydration Station</strong> update:
    </p>

    <p>Bottles Washed: {{bottles}} bottles washed</p>
    <p>Highest Use Time: {{time}}</p>
    <p>Power Efficiency: {{power}}</p>
    <p>Electricity Usage: {{electric}}</p>

    <p>
      Best regards,<br />
      The Hydration Station Team
    </p>
  </div>
`;
