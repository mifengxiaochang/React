import EventHandler from './EventHandler';

export default class SearchBox extends EventHandler {
    constructor(props) {
        super(props);
    };



    render() {
        return <div className='detailedreport-search custom-float-right'>
            <R.Searchbox
                width='300px'
                title={I18N.getReportingValue("RE_Common_Search_Placeholder_Entry")}
                placeholder={I18N.getReportingValue("RE_Common_Search_Placeholder_Entry")}
                disabled={false}
                onSearch={this.onSearch}
                onStop={this.onStop}
            />
        </div>
    };
};