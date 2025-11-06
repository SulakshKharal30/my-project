/**
 * src/utils/validator.js
 * 
 * Common input validation helpers for ChatOps Deployment Bot
 */

const semver = require('semver');
const Service = require('../models/Service');
const Environment = require('../models/Environment');

class Validator {
  /**
   * Validate if a Slack command input is non-empty string
   * @param {string} input 
   */
  static validateString(input) {
    if (typeof input !== 'string' || input.trim() === '') {
      throw new Error('Input must be a non-empty string.');
    }
    return input.trim();
  }

  /**
   * Validate a semantic version string
   * @param {string} version 
   */
  static validateVersion(version) {
    if (!semver.valid(version)) {
      throw new Error(`Invalid version format: ${version}. Must follow semver (e.g., 1.2.3)`);
    }
    return version;
  }

  /**
   * Validate service exists in DB
   * @param {string} serviceName 
   */
  static async validateService(serviceName) {
    const service = await Service.findOne({ name: serviceName });
    if (!service) {
      throw new Error(`Service "${serviceName}" not found.`);
    }
    return service;
  }

  /**
   * Validate environment exists in DB
   * @param*
