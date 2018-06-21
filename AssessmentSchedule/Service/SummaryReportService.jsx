import * as CommonService from '../../../Services/CommonService';
const targetComponent = SAComponents.COMPONENT_ASSESSMENTREPORTING;
const mockDefaultUrl = 'http://yapi.avepoint.net/mock/257/api';
const defaultUrl = 'api/';

export function getAssessmentScheduleSummary(param) {
    let option = {
        targetComponent: targetComponent,
        url: `${defaultUrl}schedulesummary`,
        data: JSON.stringify(param),
        method: 'POST'
    };
    return fetchUtility(option);
}


export function getScheduleModuleAndModeFilters(data) {
    let url = `${defaultUrl}schedulesummary/schedulesummaryfilters`;
    let option = {
        targetComponent: targetComponent,
        url,
        method: 'POST',
        data: JSON.stringify(data)
    };
    return fetchUtility(option);
}


