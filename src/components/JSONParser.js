import React, { Component } from 'react';
import json2csv from 'json2csv';
import { map } from 'lodash';
import request from 'request';

class JSONParser extends Component {
  constructor(props) {
    super();

    const { source } = props;

    const output = this.parseJSON(source);

    this.state = {
      output,
    };

    /*
    const apiUrl = 'https://aquent.com/api/content/render/false/query/+structureName:AquentJob%20+AquentJob.isPosted:true/orderby/modDate%20desc';
    request.get(apiUrl, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        debugger;

        const output = this.parseJSON(body);
        this.state = {
          output,
        };
      }
    });
    */
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

        <h1>Source</h1>
        <textarea style={styles.output} value={JSON.stringify(source)} readOnly />
      </div>
    );
  }

  parseJSON(source) {
    const fields = [
      'title',
      'company',
      'company_url',
      'location',
      'description',
      'apply_url',
      'apply_email',
      'featured',
      'purchaser_email',
      'created_at',
      'employer_id',
      'category',
      'logo',
      'published',
    ];

    const jobs = map(source.contentlets, (listing) => {
      return {
        title: listing.title,
        company: 'Aquent',
        company_url: 'http://aquent.com', //TODO: are all jobs going to be attributed to aquent?
        location: listing.marketId,
        description: `${listing.description}<br />${listing.clientDescription}`,
        apply_url: `https://aquent.com/find-work/${listing.jobId}`,
        apply_email: 'applyemail@aquent.com', //TODO: what address to use here?
        featured: 'false', //TODO: all unfeatured? 
        purchaser_email: 'purchaseremail@aquent.com', //TODO: what address to use here?
        created_at: listing.postedDate,
        employer_id: 111, //TODO: get Aquent's employerID
        category: 1, //TODO: get category
        logo: 'https://thegymnasium.com/static/gymnasium/images/gymnasiumLogo.png',
        published: 'false',
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