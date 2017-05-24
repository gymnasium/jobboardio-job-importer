import React, { Component } from 'react';
import json2csv from 'json2csv';
import { map } from 'lodash';
import request from 'request';
import { Markets } from '../utils/constants';
import moment from 'moment';

class JSONParser extends Component {
  constructor(props) {
    super();

    let output;

    const JOB_COUNT = 300;

    // using es lucene syntax: https://dotcms.com/docs/latest/content-search-syntax#Lucene
    // format is !ID && !ID && !ID
    const marketsToExclude = '!92%20&&%20!79%20&&%20!64%20&&%20!44'; // japanese marketIds
    const apiUrl = `https://aquent.com/api/content/render/false/query/+structureName:AquentJob%20+AquentJob.marketId:(${marketsToExclude})/orderby/modDate%20desc/limit/${JOB_COUNT}`;
    request.get(apiUrl, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const jobs = JSON.parse(body).contentlets;
        output = this.parseJobs(jobs);
        this.setState({
          output,
        });
      }
    });
  }

  render() {
    const {
      output 
    } = this.state || {};

    const styles = {
      output: {
        width: '90%',
        height: '25em',
        marginTop: '2em',
        fontSize: '1.25em',
      },
    };

    return (
      <div>
        <h1>As CSV</h1>
        <textarea style={styles.output} value={output} readOnly />
      </div>
    );
  }

  parseJobs(jobListings) {
    const fields = [
      'title',
      'company',
      'company_url',
      'location',
      'marketId',
      'marketName',
      'description',
      'apply_url',
      'apply_email',
      'featured',
      'purchaser_email',
      'placement_type',
      'created_at',
      'employer_id',
      'category',
      'logo',
      'published',
      'is_posted',
    ];

    const jobs = map(jobListings, (listing) => {

      let brand = listing.brand;
      let purchaserEmail;
      let employerId;
      let companyUrl;
      let applyUrl;
      let logoUrl = 'https://thegymnasium.com/static/gymnasium/images/gymnasiumLogo.png';

      switch (brand) {
        case 'Firebrand':
          applyUrl =  `https://aquent.com/find-work/${listing.jobId}`;
          companyUrl = 'https://firebrandtalent.com.au';
          employerId = 'ad83073e-96c8-457d-b44a-7b45299625a';
          purchaserEmail = 'amiller+fbjobs@aquent.com';
          logoUrl = 'https://gymnasium.github.io/jobs/img/logo-fb.jpg';
          break;

        case 'Vitamin T': 
          applyUrl = `https://vitamintalent.com/talent/jobs/${listing.jobId}`;
          companyUrl = 'https://vitamintalent.com';
          employerId = '857f3eea-8852-401a-8b53-03cddeff1841';
          logoUrl = 'https://gymnasium.github.io/jobs/img/logo-vt.png';
          purchaserEmail = 'amiller+vtjobs@aquent.com'; 
          break;

        case 'Aquent':
        default:
          applyUrl = `https://aquent.com/find-work/${listing.jobId}`;
          brand = 'Aquent'; // some brands may come in as not 'Aquent'.  Handling the default: case here
          companyUrl = 'https://aquent.com';
          employerId = 'ad253037-147e-499c-860b-67c3aa91f296';
          logoUrl = 'https://gymnasium.github.io/jobs/img/logo-aquent.png';
          purchaserEmail = 'amiller+aqjobs@aquent.com';
      }

      return {
        title: listing.title,
        company: brand,
        company_url: companyUrl, //TODO: are all jobs going to be attributed to aquent?
        location: listing.marketId,
        marketId: listing.locationId,
        marketName: Markets[listing.locationId],
        description: `${listing.description}<br />${listing.clientDescription}`,
        apply_url: applyUrl,
        apply_email: '',
        featured: false,
        purchaser_email: purchaserEmail,
        placement_type: listing.placementTypeId,
        created_at: moment(listing.postedDate).format('MM/DD/YY'),
        employer_id: employerId,
        category: listing.minorSpecialty1, 
        logo: logoUrl,
        published: false,
        is_posted: listing.isPosted,
      }
    });
    
    const output = json2csv({
      data: jobs,
      fields,
    });

    return output;
  }
}

export default JSONParser;