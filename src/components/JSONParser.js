import React, { Component } from 'react';
import json2csv from 'json2csv';
import { map } from 'lodash';
import request from 'request';
import { Markets } from '../utils/constants';

class JSONParser extends Component {
  constructor(props) {
    super();

    let output;
    const apiUrl = 'https://aquent.com/api/content/render/false/query/+structureName:AquentJob%20+AquentJob.isPosted:true/orderby/modDate%20desc';
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
      source
    } = this.props;

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

      switch (brand) {
        case 'Vitamin T': 
          purchaserEmail = 'amiller+vtjobs@aquent.com';
          employerId = '857f3eea-8852-401a-8b53-03cddeff1841';
          companyUrl = 'vitamintalent.com';
          break;

        case 'Aquent':
        default:
          purchaserEmail = 'amiller+aqjobs@aquent.com';
          employerId = 'ad253037-147e-499c-860b-67c3aa91f296';
          companyUrl = 'aquent.com';
      }
      debugger;

      return {
        title: listing.title,
        company: 'Aquent',
        company_url: companyUrl, //TODO: are all jobs going to be attributed to aquent?
        location: listing.marketId,
        marketId: listing.locationId,
        marketName: Markets[listing.locationId],
        description: `${listing.description}<br />${listing.clientDescription}`,
        apply_url: `https://aquent.com/find-work/${listing.jobId}`,
        apply_email: '',
        featured: false,
        purchaser_email: purchaserEmail,
        placement_type: listing.placementTypeId,
        created_at: listing.postedDate,
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