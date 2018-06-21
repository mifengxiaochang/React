const eventList = [
    "pieCallBack",
    'getPieChartData',
];
class PieChartPanel extends React.Component {
    constructor(props) {
        super(props);
        eventList.map(item => {
            this[item] = this[item].bind(this);
        });
    }

    pieCallBack(data, isCheck) {
        this.props.pieCallBack && this.props.pieCallBack(data, isCheck);
    }

    getPieChartData() {
        let data = [{ name: "None", value: 100 }];
        if (this.props.items && this.props.items.length > 0) {
            data = this.props.items;
        }
        return data;
    }


    getPieChartDescription() {
        let group = [],
            groupItem = null;
        for (let item of this.props.items) {
            groupItem =
                <div className='piechart-status-row' key={`${item.name}_${item.value}`}>
                    <div className='piechart-status-cell'>
                        <span className="piechart-status-icon" style={{ backgroundColor: `${item.color}` }}></span>
                        <span>{item.name}</span>
                    </div>
                    <div className='piechart-status-cell'>{item.value}</div>
                </div>;

            group.push(groupItem);
        }
        return group;
    }

    render() {
        return (
            <div>
                <div className='piechart-title' title={this.props.pieTitle}>{this.props.pieTitle}</div>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <R.PieChart {...{
                        data: this.getPieChartData(),
                        centerContent: this.props.centerContent,
                        isSupportSectorClick: true,
                        callBack: (args) => { this.pieCallBack(args.data, args.isCheck) },
                        height: this.props.height || 440,
                        activeIndex: (this.props.activeIndex !== undefined) ? this.props.activeIndex : -1,
                        isShowTextInSector: this.props.isShowTextInSector !== undefined ? this.props.isShowTextInSector : true,
                    }}></R.PieChart>
                    <div className="piechart-status">
                        {this.getPieChartDescription()}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = PieChartPanel;