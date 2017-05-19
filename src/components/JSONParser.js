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

    const apiUrl = `https://aquent.com/api/content/render/false/query/+structureName:AquentJob/orderby/modDate%20desc/limit/${JOB_COUNT}`;
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

      const brand = listing.brand;
      let purchaserEmail;
      let employerId;
      let companyUrl;
      let applyUrl;

      switch (brand) {
        case 'Vitamin T': 
          purchaserEmail = 'amiller+vtjobs@aquent.com';
          employerId = '857f3eea-8852-401a-8b53-03cddeff1841';
          companyUrl = 'vitamintalent.com';
          applyUrl = `https://vitamintalent.com/talent/jobs/${listing.jobId}`;
          break;

        case 'Aquent':
        default:
          purchaserEmail = 'amiller+aqjobs@aquent.com';
          employerId = 'ad253037-147e-499c-860b-67c3aa91f296';
          companyUrl = 'aquent.com';
          applyUrl = `https://aquent.com/find-work/${listing.jobId}`;
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
        logo: 'https://thegymnasium.com/static/gymnasium/images/gymnasiumLogo.png',
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