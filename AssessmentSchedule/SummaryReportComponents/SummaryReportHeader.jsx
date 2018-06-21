import * as React from 'react';
import * as Service from '../Service/SummaryReportService';
import * as CommonUntil from '../../../Utilities/CommonUtil';

const eventsArr = [
    "handleModuleSelectedChanged",
    "handleModeSelectedChanged",
    "handleOnSearch",
    "handleOnStopSearch"
];

let ModeFilterData = () => {
    return [
        { name: I18N.getReportingValue('RE_TA_SummaryReport_OnPaper_Entry'), value: 0, isChecked: true },
        { name: I18N.getReportingValue('RE_SC_SummaryReport_Online_Entry'), value: 1, isChecked: true },
        { name: I18N.getReportingValue('RE_SC_SummaryReport_Practical_Entry'), value: 1, isChecked: true }
    ]
};

export class SummaryReportHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            moduleItemSource:[],
            modeItemSource: []
        }

        eventsArr.map((ev) => {
            this[ev] = this[ev].bind(this);
        });

        this.allModuleItems = [];
        this.selectedMode = null;
    }

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    initPage(filters) {
        if (filters.modules.length > 0) {
            this.convertModules(filters.modules); 
        }
       
        this.convertModes(filters.modes);
    }

    convertModules(modules) {

        if (modules.length > 0) {
            modules.forEach(item => {
                item.isChecked = true;
            });
            if (this._isMounted) {
                this.setState({
                    moduleItemSource: modules
                });
            }
        }        

    }

    convertModes(modes) {
        let modeItemSource = [];
        if (modes && modes.length > 0) {
            if (this.state.modeItemSource.length == status.length) {
                let exceptArr = this.state.modeItemSource.filter(item => !modes.includes(item.name));
                if (exceptArr.length > 0) {
                    modes.forEach((item) => {
                        modeItemSource.push(
                            {
                                name: item,
                                isChecked: false
                            }
                        );
                    });
                } else {
                    this.state.modeItemSource.forEach((item) => {
                        modeItemSource.push(
                            {
                                name: item.name,
                                isChecked: item.isChecked
                            }
                        );
                    })
                }
            } else {
                modes.forEach((item) => {
                    modeItemSource.push(
                        {
                            name: item,
                            isChecked: false
                        }
                    );
                });
            }
        }

        if (this._isMounted) {
            this.setState({
                modeItemSource: modeItemSource
            });
        }
            
    }

    callback(args,type) {
        this.props.callback && this.props.callback(args, type);
    }

    handleModuleSelectedChanged(e, args) {   
        //let selectedItems = args.newValue.items;
        //if (selectedItems) {
        //    let resultList = [];
        //    selectedItems.forEach((item) => {
        //        resultList.push(item.moduleId);
        //    });
        //    this.callback(resultList, "module");
        //} 
        this.selectedMode = {};
        this.props.handleModuleSelectedChanged(args);
        
    }

    handleModeSelectedChanged(e, args) {
        //let selectedItems = args.newValue.items;
        //if (selectedItems && selectedItems.length > 0) {
        //    let resultList = [];
        //    selectedItems.forEach((item) => {
        //        resultList.push(item.name);
        //    });
        //    this.callback(resultList, "mode");
        //} 

        this.selectedMode = {};
        args.newValue.items.forEach((item, idx) => {
            this.selectedMode[item.name] = "";
        });
        this.props.handleModeSelectedChanged(args);
    }

    handleOnSearch(e,args) {
        let searchText = args.newValue;
        if (searchText.trim()) {
            this.callback(searchText, "search");
        }
    }

    handleOnStopSearch(e, args) {
        this.callback("", "search");
    }

    getMode() {
        let modes = [];
        if (this.props.moduleFilters && this.props.moduleFilters.length > 0) {
            let obj = {};
            this.props.moduleFilters.forEach((s, idx) => {
                if (s.isChecked) {
                    s.mode.forEach((st, i) => {
                        obj[st] = "";
                    });
                }
            });
            for (let p in obj) {
                modes.push({ name: p, isChecked: this.selectedMode == null ? true : this.selectedMode.hasOwnProperty(p) });
            }
        }
        return modes;
    }
    
    render() {
        return (
            <div id="summary-report-header" className="flex-row-container">
                <div className="flex-item" style={{ marginBottom: "10px" }}>
                    <div className="inline-block">
                        <div>
                            {
                                //I18N.getReportingValue('RE_Common_Module_Entry')
                            }
                        </div>
                        <div className="margin-top5">
                            <R.Multicombobox
                                width={220}
                                dataCheckedField="isChecked"
                                dataDynamicField="isDynamic"
                                dataTextField="moduleCode"

                                items={this.props.moduleFilters}
                                selectionChanged={this.handleModuleSelectedChanged}

                                allText={I18N.getReportingValue('RE_Common_Module:_Entry') + I18N.getReportingValue("RE_Common_All_Entry")}
                                selectedItemTemplate={I18N.getReportingValue("RE_Common_Module:_Entry") + " {0} "}
                                selectedItemsTemplate={I18N.getReportingValue("RE_Common_Module:_Entry") + " {0} " + I18N.getReportingValue("RE_Common_Items_Entry")}
                                noneText={I18N.getReportingValue('RE_Common_Module:_Entry') + I18N.getReportingValue("RE_Common_None_Entry")}
                                popupWidth="100%"
                            />
                        </div>
                    </div>
                    <div className="inline-block" style={{ marginLeft: '10px' }}>
                        <div>{
                            //I18N.getReportingValue('RE_Common_Mode_Entry')
                        }
                        </div>
                        <div className="margin-top5">
                            <R.Multicombobox
                                width={220}
                                popupWidth="100%"
                                dataCheckedField="isChecked"
                                dataTextField="name"

                                items={this.getMode()}
                                selectionChanged={this.handleModeSelectedChanged}

                                allText={I18N.getReportingValue('RE_Common_Mode_Entry') + ":" + I18N.getReportingValue("RE_Common_All_Entry")}
                                selectedItemTemplate={I18N.getReportingValue("RE_Common_Mode_Entry") + ": {0}"}
                                selectedItemsTemplate={I18N.getReportingValue("RE_Common_Mode_Entry") + ": {0} " + I18N.getReportingValue("RE_Common_Items_Entry")}
                                noneText={I18N.getReportingValue('RE_Common_Mode_Entry') + ":" + I18N.getReportingValue("RE_Common_None_Entry")}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-item">
                    <div className="float-right margiontop5">
                        <R.Searchbox
                            title={"input keyword"}
                            onSearch={this.handleOnSearch}
                            onStop={this.handleOnStopSearch}
                            placeholder={I18N.getReportingValue("RE_Common_Search_Placeholder_Entry")}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = SummaryReportHeader;