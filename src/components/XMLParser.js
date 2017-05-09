import React, { Component } from 'react';
import { map } from 'lodash';
import request from 'request';

import json2csv from 'json2csv';
import xml2js from 'xml2js';
import moment from 'moment';

class XMLParser extends Component {
  constructor(props) {
    super();

    this.apiUrl = 'https://gist.githubusercontent.com/mbifulco/bfb4e491d1ad49a5f841896f0d5e9d68/raw/48a755f2d2225810a928320d5c42c89707fc399f/xmlinput.xml';
    request.get(this.apiUrl, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        this.parseXML(body);
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
        <h1>pulling from XML in this gist:</h1>
        <small>{this.apiUrl}</small>
        <textarea style={styles.output} value={output} readOnly />
      </div>
    );
  }

  parseXML(xmlString) {
    xml2js.parseString(xmlString, (err, result) => {
      const jobs = result.source.job;
      this.setState({
        output: this.parseJSON(jobs)
      });
    });
  }

  parseJSON(inputJobs) {
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

    const jobs = map(inputJobs, (job) => {
      return {
        title: job.title[0],
        company: job.company[0],
        company_url: 'http://aquent.com', //TODO: are all jobs going to be attributed to aquent?
        location: job.city[0],
        description: job.description[0],
        apply_url: job.url[0],
        // apply_email: 'applyemail@aquent.com', //TODO: what address to use here?
        featured: 'false', //TODO: all unfeatured? 
        // purchaser_email: 'purchaseremail@aquent.com', //TODO: what address to use here?
        created_at: moment(job.date[0]).format('MM/DD/YY'),
        employer_id: 111, //TODO: get Aquent's employerID
        category: job.category[0], //TODO: get category
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

export default XMLParser;