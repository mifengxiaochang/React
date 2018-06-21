import * as CommonService from '../../../Services/CommonService'

//Venue Availability
export function getAvailabilityVenues(data) {
    var url = "/api/availabilityvenues";
    return CommonService.Post(url, data);
}
export function getDates() {
    var url = "/api/availabilityvenues/venuedatefilters";
    return CommonService.Get(url);
}
export function getSlots(timeStr) {
    var url = `/api/availabilityvenues/slotfilters?date=${timeStr}`;
    return CommonService.Get(url);
}
export function getVenues(date, slot) {
    var url = `/api/availabilityvenues/venuedatefilters?date=${date}&slot=${slot}`;
    return CommonService.Get(url);
}
export function getVenueTypes(data) {
    var url = "/api/availabilityvenues/venuetypefilters";
    return CommonService.Post(url, data);
}

export function getVenueAvailabilityFilters(data){
    var url = "/api/venueavailability/getvenueavailabilityfilters";
    return CommonService.Post(url, data);
}
export function getVenueAvailability(data){
    var url = "/api/venueavailability/getvenueavailability";
    return CommonService.Post(url, data);
}
//end

//Assessment Information Submission Progress Report
export function getScheduleApprovalPieChart(data) {
    return CommonService.Post('api/informationapproval/piechart', data);
}
export function getScheduleApproval(data) {
    return CommonService.Post('api/informationapproval', data);
}
//end