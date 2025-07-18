import sanitizeHtml from 'sanitize-html';
import { IJob } from '@/backend/models/IJob';
import {
  ICompanyCA,
  ICompanyDetails,
  ICompanyLeadership,
  ICompanyLocation,
  ICompanyMarketPositioning,
  ICompanyNafApe,
  ICompanyShareCapital,
  IJobEntity,
  ISalary,
  JobPreference,
} from '@/types/IJobEntity';

/**
 * EN: Tool class to sanitize a Job object (and its sub-documents) before saving.
 * FR: Classe utilitaire pour sanitiser un objet Job (et ses sous-documents) avant enregistrement.
 */
export class JobSanitizer {
  /**
   * EN: Sanitize a raw string by stripping all tags and attributes non autorisés.
   * FR: On autorise uniquement les balises basiques si besoin, sinon on vide allowedTags pour supprimer
   * absolument tout HTML.
   */
  private static sanitizeString(input: string): string {
    return sanitizeHtml(input, {
      // EN: Nothing allowed, so we remove all HTML tags
      // FR: Aucun tag autorisé (tout est retiré)
      allowedTags: [],
      // EN: Nothing allowed, so we remove all attributes
      // FR: Aucun attribut autorisé
      allowedAttributes: {}, 
      // EN: We allow only basic text content, no HTML entities
      // FR: On n'autorise pas de protocoles spéciaux (javascript:, data:, etc.)
      allowedSchemes: [],    
    }).trim();
  }

  /**
   * EN: Sanitize an array of strings.
   * FR: Parcourt un tableau de chaînes et renvoie un nouveau tableau "nettoyé".
   */
  private static sanitizeStringArray(arr: string[]): string[] {
    const response: string[] = [];
    // EN: Iterate through the array and sanitize each string
    // FR: On parcourt le tableau et on sanitize chaque chaîne
    if (Array.isArray(arr)) {
      for (let index = 0; index < arr.length; index++) {
        const s = arr[index];
        if (typeof s === 'string') {
          const sanitized = this.sanitizeString(s);
          if (sanitized && sanitized.length > 0) response.push(sanitized);
        }
      }
    }
    return response;
  }

  /**
   * EN: Sanitize the sub-document preference (JobPreference).
   * We do not sanitize the enumeration values, but we ensure they are valid.
   * FR: Sanitize le sous-document preference (JobPreference).
   * On ne sanitize pas les valeurs de l'énumération, mais on s'assure qu'elles sont valides.
   */
  private static sanitizePreference(pref: JobPreference | undefined): JobPreference | undefined {
    let result: JobPreference | undefined = undefined;
    if (pref) {
      const validPreferences: JobPreference[] = ['like', 'dislike', null];
      result = validPreferences.includes(pref)
        ? result = pref
        : result = undefined;
    }
    return result;
  }

  /**
   * EN: Sanitize the sub-document Salary (Here, we do not have any String fields to sanitize, so we keep it as is.).
   * We keep currency (String) in the sandbox, but min/max are Numbers -> no XSS risk.
   * FR: Sanitize le sous-document Salary (ici, pas de champ String à purifier, on garde tel quel).
   * On conserve currency (String) en l'épuration sandbox, mais min/max sont des Number -> aucun risque XSS.
   */
  private static sanitizeSalary(sal: ISalary): ISalary {
    return {
      currency: (sal.currency && typeof sal.currency === 'string')
        ? this.sanitizeString(sal.currency) || null
        : null,
      min: (sal.min && typeof sal.min === 'number')
        ? parseInt(sal.min.toString())
        : null,
      max: (sal.max && typeof sal.max === 'number')
        ? parseInt(sal.max.toString())
        : null,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyLocation.
   * FR: Sanitize le sous-document CompanyLocation.
   */
  private static sanitizeCompanyLocation(loc: ICompanyLocation): ICompanyLocation {
    return {
      address: loc.address ? this.sanitizeString(loc.address) || null : null,
      city: loc.city ? this.sanitizeString(loc.city) || null : null,
      country: loc.country ? this.sanitizeString(loc.country) || null : null,
      latitude: loc.latitude && typeof loc.latitude === 'number'
        ? loc.latitude
        : null,
      longitude: loc.longitude && typeof loc.longitude === 'number'
        ? loc.longitude
        : null,
      postal_code: loc.postal_code ? this.sanitizeString(loc.postal_code) || null : null,
      siret: loc.siret ? this.sanitizeString(loc.siret) || null : null,
      workforce: loc.workforce && typeof loc.workforce === 'number'
        ? parseInt(loc.workforce.toString())
        : null,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyLeadership.
   * FR: Sanitize le sous-document CompanyLeadership.
   */
  private static sanitizeCompanyLeadership(lead: ICompanyLeadership): ICompanyLeadership {
    return {
      email: lead.email ? this.sanitizeString(lead.email) || null : null,
      github: lead.github ? this.sanitizeString(lead.github) || null : null,
      linkedin: lead.linkedin ? this.sanitizeString(lead.linkedin) || null : null,
      name: lead.name ? this.sanitizeString(lead.name) || null : null,
      phone: lead.phone ? this.sanitizeString(lead.phone) || null : null,
      position: lead.position ? this.sanitizeString(lead.position) || null : null,
      twitter: lead.twitter ? this.sanitizeString(lead.twitter) || null : null,
      website: lead.website ? this.sanitizeString(lead.website) || null : null,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyMarketPositioning.
   * FR: Sanitize le sous-document CompanyMarketPositioning.
   */
  private static sanitizeCompanyMarketPositioning(
    pos: ICompanyMarketPositioning
  ): ICompanyMarketPositioning {
    return {
      competitors: pos.competitors ? this.sanitizeStringArray(pos.competitors) : null,
      differentiators:
        pos.differentiators ? this.sanitizeStringArray(pos.differentiators) : null,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyCA (revenue).
   * FR: Sanitize le sous-document CompanyCA (revenu).
   */
  private static sanitizeCompanyCA(ca: ICompanyCA): ICompanyCA {
    return {
      amount: (ca.amount && typeof ca.amount === 'number')
        ? ca.amount
        : null,
      currency: (ca.currency && typeof ca.currency === 'string')
        ? this.sanitizeString(ca.currency) || null
        : null,
      siret: this.sanitizeString(ca.siret),
      year: (ca.year && typeof ca.year === 'number')
        ? ca.year
        : null,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyShareCapital.
   * FR: Sanitize le sous-document CompanyShareCapital.
   */
  private static sanitizeCompanyShareCapital(cap: ICompanyShareCapital): ICompanyShareCapital {
    return {
      amount: (cap.amount && typeof cap.amount === 'number') ? cap.amount : 0,
      currency: cap.currency ? this.sanitizeString(cap.currency) || null : null,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyNafApe.
   * FR: Sanitize le sous-document CompanyNafApe.
   */
  private static sanitizeCompanyNafApe(naf: ICompanyNafApe): ICompanyNafApe {
    return {
      code: naf.code ? this.sanitizeString(naf.code) || null : null,
      activity: naf.activity ? this.sanitizeString(naf.activity) || null : null,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyDetails. This method re-applies sanitization on all its fields.
   * FR: Sanitize le sous-document CompanyDetails, en ré-appliquant les sanitize sur tous ses champs.
   */
  private static sanitizeCompanyDetails(details: ICompanyDetails): ICompanyDetails {
    let creation_date: Date | null = null;
    if (details.creation_date) {
      creation_date = new Date(details.creation_date);
      if (isNaN(creation_date.getTime())) {
        creation_date = null; // If the date is invalid, set it to null
      }
    }
    return {
      clients: details.clients ? this.sanitizeStringArray(details.clients) : null,
      creation_date: creation_date, // Date -> pas de sanitisation HTML/JS
      description: (details.description && typeof details.description === 'string')
        ? this.sanitizeString(details.description) || null
        : null,
      global_workforce: (details.global_workforce && typeof details.global_workforce === 'number')
        ? parseInt(details.global_workforce.toString())
        : null,
      leadership:
        details.leadership && Array.isArray(details.leadership)
          ? details.leadership.map((lead) => this.sanitizeCompanyLeadership(lead))
          : null,
      legal_form: (details.legal_form && typeof details.legal_form === 'string')
        ? this.sanitizeString(details.legal_form) || null
        : null,
      locations:
        details.locations && Array.isArray(details.locations)
          ? details.locations.map((loc) => this.sanitizeCompanyLocation(loc))
          : null,
      logo: (details.logo && typeof details.logo === 'string')
        ? this.sanitizeString(details.logo) || null
        : null,
      market_positioning:
        details.market_positioning
          ? this.sanitizeCompanyMarketPositioning(details.market_positioning)
          : null,
      products: details.products ? this.sanitizeStringArray(details.products) : null,
      revenue:
        details.revenue && Array.isArray(details.revenue)
          ? details.revenue.map((r) => this.sanitizeCompanyCA(r))
          : null,
      sector: (details.sector && typeof details.sector === 'string')
        ? this.sanitizeString(details.sector) || null
        : null,
      share_capital:
        details.share_capital
          ? this.sanitizeCompanyShareCapital(details.share_capital)
          : null,
      siren: (details.siren && typeof details.siren === 'string')
        ? this.sanitizeString(details.siren) || null
        : null,
      naf_ape:
        details.naf_ape ? this.sanitizeCompanyNafApe(details.naf_ape) : null,
      website: (details.website && typeof details.website === 'string')
        ? this.sanitizeString(details.website) || null
        : null,
    };
  }

  /**
   * EN: Sanitize a Job object partially, returning a Partial<IJob>.
   * This method is used to sanitize only the fields that are present in the input.
   * FR: Sanitize un objet Job partiellement, renvoyant un Partial<IJob>.
   * Cette méthode est utilisée pour nettoyer uniquement les champs présents dans l'entrée.
   */
  public static partialSanitize(input: Partial<IJob>): Partial<IJob> {
    const output: Partial<IJob> = {};

    if (input.collective_agreement !== undefined) {
      output.collective_agreement = (input.collective_agreement && typeof input.collective_agreement === 'string')
        ? this.sanitizeString(input.collective_agreement)
        : null;
    }

    if (input.company !== undefined) {
      output.company = (input.company && typeof input.company === 'string')
        ? this.sanitizeString(input.company)
        : null;
    }

    if (input.company_details !== undefined) {
      output.company_details = (input.company_details && typeof input.company_details === 'object')
        ? this.sanitizeCompanyDetails(input.company_details)
        : null;
    }

    if (input.content !== undefined) {
      output.content = (input.content && typeof input.content === 'string')
        ? this.sanitizeString(input.content)
        : null;
    }

    if (input.contract_type !== undefined) {
      output.contract_type = (input.contract_type && typeof input.contract_type === 'string')
        ? this.sanitizeString(input.contract_type)
        : null;
    }

    if (input.cv_id !== undefined) {
      output.cv_id = (input.cv_id && typeof input.cv_id === 'string')
        ? input.cv_id
        : null;
    }

    if (input.date !== undefined) {
      let date: string | null = null;
      if (input.date && typeof input.date === 'string') {
        date = this.sanitizeString(input.date);
        // If the date is invalid, set it to null
        const d = new Date(date);
        if (isNaN(d.getTime())) date = null;
      }
      output.date = date;
    }

    if (input.description !== undefined) {
      output.description = (input.description && typeof input.description === 'string')
        ? this.sanitizeString(input.description)
        : null;
    }

    if (input.interest_indicator !== undefined) {
      output.interest_indicator = (input.interest_indicator && typeof input.interest_indicator === 'string')
        ? this.sanitizeString(input.interest_indicator)
        : undefined;
    }

    if (input.language !== undefined) {
      output.language = (input.language && typeof input.language === 'string')
        ? this.sanitizeString(input.language)
        : null;
    }

    if (input.level !== undefined) {
      output.level = (input.level && typeof input.level === 'string')
        ? this.sanitizeString(input.level)
        : null;
    }

    if (input.location !== undefined) {
      output.location = (input.location && typeof input.location === 'string')
        ? this.sanitizeString(input.location)
        : null;
    }

    if (input.methodologies !== undefined) {
      output.methodologies = Array.isArray(input.methodologies)
        ? this.sanitizeStringArray(input.methodologies)
        : null;
    }

    if (input.motivation_letter !== undefined) {
      output.motivation_letter = (input.motivation_letter && typeof input.motivation_letter === 'string')
        ? this.sanitizeString(input.motivation_letter)
        : null;
    }

    if (input.motivation_email !== undefined) {
      output.motivation_email = (input.motivation_email && typeof input.motivation_email === 'string')
        ? this.sanitizeString(input.motivation_email)
        : null;
    }

    if (input.original_job_id !== undefined) {
      output.original_job_id = (input.original_job_id && typeof input.original_job_id === 'string')
        ? this.sanitizeString(input.original_job_id)
        : null;
    }

    if (input.preference !== undefined) {
      output.preference = input.preference && typeof input.preference === 'string'
        ? this.sanitizePreference(input.preference)
        : null;
    }

    if (input.salary !== undefined) {
      output.salary = (input.salary && typeof input.salary === 'object')
        ? this.sanitizeSalary(input.salary)
        : undefined;
    }

    if (input.source !== undefined) {
      output.source = (input.source && typeof input.source === 'string')
        ? this.sanitizeString(input.source)
        : undefined;
    }

    if (input.technologies !== undefined) {
      output.technologies = Array.isArray(input.technologies)
        ? this.sanitizeStringArray(input.technologies)
        : null;
    }

    if (input.teleworking !== undefined) {
      output.teleworking =  (typeof input.teleworking === 'boolean')
       ? input.teleworking
       : false;
    }

    if (input.title !== undefined && typeof input.title === 'string') {
      switch (input.title) {
        case '':
          output.title = 'unknown';
          break;
        case null:
          output.title = 'unknown';
          break;
        default:
          output.title = this.sanitizeString(input.title);
      }
    }

    if (input.motivation_email_subject !== undefined) {
      output.motivation_email_subject = (input.motivation_email_subject && typeof input.motivation_email_subject === 'string')
        ? this.sanitizeString(input.motivation_email_subject)
        : null;
    }

    if (input.motivation_email_draft_url !== undefined) {
      output.motivation_email_draft_url = (input.motivation_email_draft_url && typeof input.motivation_email_draft_url === 'string')
        ? this.sanitizeString(input.motivation_email_draft_url)
        : null;
    }

    if (input.motivation_email_to !== undefined) {
      output.motivation_email_to = (input.motivation_email_to && typeof input.motivation_email_to === 'string')
        ? this.sanitizeString(input.motivation_email_to)
        : null;
    }

    return output;
  }

  /**
   * EN: Method sanitize: returns a new "cleaned" IJob object.
   * We take each field and apply sanitize if it's a string, or an ad-hoc method if it's a sub-object.
   * FR: Méthode principale : renvoie un nouvel objet IJob "nettoyé".
   * On reprend chacun des champs et on applique sanitize si c'est une string, ou méthode ad-hoc si c'est un sous-objet.
   */
  public static sanitize(input: Partial<IJob>): IJob {
    const output: Partial<IJob> = this.partialSanitize(input);

    const response: IJobEntity = {
      collective_agreement: output.collective_agreement || null,
      company: output.company || null,
      company_details: output.company_details || null,
      content: output.content || null,
      contract_type: output.contract_type || null,
      cv_id: output.cv_id || null,
      date: output.date || null,
      description: output.description || null,
      interest_indicator: output.interest_indicator || null,
      language: output.language || null,
      level: output.level || null,
      location: output.location || null,
      methodologies: output.methodologies || null,
      motivation_letter: output.motivation_letter || null,
      motivation_email: output.motivation_email || null,
      motivation_email_draft_url: output.motivation_email_draft_url || null,
      motivation_email_subject: output.motivation_email_subject || null,
      motivation_email_to: output.motivation_email_to || null,
      original_job_id: output.original_job_id || null,
      preference: output.preference || null,
      salary: output.salary || null,
      source: output.source || null,
      technologies: output.technologies || null,
      teleworking: output.teleworking || false,
      title: output.title || 'unknown',
    }
    return response as IJob;
  }
}
