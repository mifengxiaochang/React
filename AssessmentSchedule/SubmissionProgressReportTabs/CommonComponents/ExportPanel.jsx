import * as React from 'react';

const eventsArr = [
    'handleExportClicked',
];
class ExportPanel extends React.Component {
    constructor(props) {
        super(props);
        eventsArr.map((ev) => {
            this[ev] = this[ev].bind(this);
        });
    }

    handleExportClicked(e, args) {
        this.props.exportClicked && this.props.exportClicked(e, args);
    }

    render() {
        return (<div style={{ marginTop: 20 }}>
            <R.Button isLink iconClass="fi-page-export-a text-green" text={I18N.getReportingValue('RE_Common_Export_Entry')}
                onClick={this.handleExportClicked} />
        </div>);
    }
}

module.exports = ExportPanel;