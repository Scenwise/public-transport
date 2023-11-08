import scanner from 'sonarqube-scanner';

export default scanner(
    {
        serverUrl: 'https://sonar.scenwise.nl/',
        token: 'squ_cb98412f91bf86bd5963bcaf7dae2f8f6b7265f1',
        options: {
            'sonar.sources': './src',
            "sonar.exclusions": "**/*.test.tsx",
            "sonar.tests": "./src",
            "sonar.test.inclusions": "**/*.test.tsx,**/*.test.ts",
            "sonar.typescript.lcov.reportPaths": "coverage/lcov.info",
            "sonar.testExecutionReportPaths": "test-report.xml",
            "sonar.eslint.reportPaths":"eslint-report.json",
            "sonar.css.stylelint.reportPaths": "stylelint-report.json"
        },
    },
    () => process.exit(),
);