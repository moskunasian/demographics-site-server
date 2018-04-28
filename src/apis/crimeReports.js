const axios = require('axios');

// Using https://github.com/happyleavesaoc/python-crimereports/blob/master/crimereports/__init__.py as a base
// Converting it to javascript since it is originally in python. License is MIT
const INCIDENT_TYPES = ['Alarm', 'Arson', 'Assault', 'Assault with Deadly Weapon',
                        'Breaking & Entering', 'Community Policing', 'Death',
                        'Disorder', 'Drugs', 'Emergency', 'Family Offense', 'Fire',
                        'Homicide', 'Kidnapping', 'Liquor', 'Missing Person', 'Other',
                        'Other Sexual Offense', 'Pedestrian Stop', 'Proactive Policing',
                        'Property Crime', 'Property Crime Commercial',
                        'Property Crime Residential', 'Quality of Life', 'Robbery',
                        'Sexual Assault', 'Sexual Offense', 'Theft', 'Theft from Vehicle',
                        'Theft of Vehicle', 'Traffic', 'Vehicle Recovery', 'Vehicle Stop',
                        'Weapons Offense'
                        ];
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const URL = 'https://www.crimereports.com/api/crimes/details.json';

/**
 *  API wrapper for crimereports.com
 *
 *  @typedef  {Object} IncidentDetails
 *  @property {string} agency The name of the agency processing the incidents
 *  @property {string} agency_type The type of processing agency
 *  @property {CrimeDetail[]} crimes The type of processing agency
 *
 *  @typedef  {Object} CrimeDetails
 *  @property {string} id Unique identifier of the crime
 *  @property {string} caseNumber The case number associated with the crime
 *  @property {Categorization} categorization Categorical information about the crime
 *  @property {string} city City containing the crime
 *  @property {string} incidentAddress The address the crime occurred at
 *  @property {string} incidentDescription Decription of the crim
 *  @property {Coordinate} location Location coordinates of the crime
 *  @property {string} primaryType 
 *  @property {string} timestamp Date and time the crime occurred
 *  
 *  @typedef  {Object} Categorization
 *  @property {string} category The crime category
 *  @property {string} subCategory The crime sub category
 *  @property {string} incidentType The incident type of the crime
 *  
 *  @typedef  {Object} Coordinate
 *  @property {number} latitude The latitude
 *  @property {number} longitude The longitude
 *  
 *  @typedef {Object} Border
 *  @property {Coordinate} topRight Top right of the border rectangle representing the desired crime area
 *  @property {Coordinate} bottomLeft Bottom left of the border rectangle representing the desired crime area
 *  
 *  @class    CrimeReports (name)
 */
class CrimeReports {


    /**
    * Requests crime data for a given border area from CrimeReports.com
    *
    * @param    {Object}    startDate    Starting date for reported incidents
    * @param    {Object}    endDate    Ending date for reported incidents
    * @param    {Border}    border    Border box for the desired incident area
    * @return   {IncidentDetails[]} A list of objects containing the location and details of an incident
    */
    async getIncidents(startDate, endDate, border) {
        try {
            let incidents = [];
            const response = await axios.get(URL, {
                params: {
                    'start_date': startDate,
                    'end_date': endDate,
                    'start_time': 0,
                    'end_time': 23,
                    'incident_types': INCIDENT_TYPES.join(','),
                    'days': DAYS.join(','),
                    'include_sex_offenders': false,
                    'lat1': border.topRight.latitude,
                    'lng1': border.topRight.longitude,
                    'lat2': border.bottomLeft.latitude,
                    'lng2': border.bottomLeft.longitude,
                    'sandbox': false,
                }
            })

            if (!('agencies' in response.data)) {
                return incidents;
            }
            for (let agency of response.data.agencies) {

                let incident = {
                    agency: agency.agency_name,
                    agency_type: agency.agency_type,
                    crimes: []
                };

                for (let crime of agency.crimes) {
                    incident.crimes.push({
                      id: crime.incident_id,
                      caseNumber: crime.case_number,
                      categorization: {
                          category: crime.categorization.category,
                          subCategory: crime.categorization.sub_category,
                          incidentType: crime.categorization.incident_type,
                      },
                      city: crime.city,
                      incidentAddress: crime.address_1,
                      incidentDescription: crime.incident_description,
                      location: {
                        latitude: crime.latitude,
                        longitude: crime.longitude,
                      },
                      primaryType: crime.incident_type_primary,
                      timestamp: crime.incident_datetime,
                  });
                }
                incidents.push(incident);
            }
            return response.data;
            return incidents;

        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = new CrimeReports();
