export default class Export extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return <div hidden className='detailedreport-export'>
            <div className='display-inline'>
                <span className="fi-page-export-a text-green image"></span>
            </div>
            <div className='display-inline' style={{ marginLeft: '5px' }}>Export</div>
        </div>
    };
};