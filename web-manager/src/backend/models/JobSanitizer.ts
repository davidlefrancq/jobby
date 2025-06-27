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
    return arr.map((s) => this.sanitizeString(s));
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
      currency: this.sanitizeString(sal.currency),
      min: sal.min,
      max: sal.max,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyLocation.
   * FR: Sanitize le sous-document CompanyLocation.
   */
  private static sanitizeCompanyLocation(loc: ICompanyLocation): ICompanyLocation {
    return {
      address: loc.address ? this.sanitizeString(loc.address) : null,
      city: loc.city ? this.sanitizeString(loc.city) : null,
      country: loc.country ? this.sanitizeString(loc.country) : null,
      latitude: loc.latitude,
      longitude: loc.longitude,
      postal_code: loc.postal_code ? this.sanitizeString(loc.postal_code) : null,
      siret: loc.siret ? this.sanitizeString(loc.siret) : null,
      workforce: loc.workforce,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyLeadership.
   * FR: Sanitize le sous-document CompanyLeadership.
   */
  private static sanitizeCompanyLeadership(lead: ICompanyLeadership): ICompanyLeadership {
    return {
      email: lead.email ? this.sanitizeString(lead.email) : null,
      github: lead.github ? this.sanitizeString(lead.github) : null,
      linkedin: lead.linkedin ? this.sanitizeString(lead.linkedin) : null,
      name: lead.name ? this.sanitizeString(lead.name) : null,
      phone: lead.phone ? this.sanitizeString(lead.phone) : null,
      position: lead.position ? this.sanitizeString(lead.position) : null,
      twitter: lead.twitter ? this.sanitizeString(lead.twitter) : null,
      website: lead.website ? this.sanitizeString(lead.website) : null,
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
      amount: ca.amount,
      currency: ca.currency ? this.sanitizeString(ca.currency) : null,
      siret: this.sanitizeString(ca.siret),
      year: ca.year,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyShareCapital.
   * FR: Sanitize le sous-document CompanyShareCapital.
   */
  private static sanitizeCompanyShareCapital(cap: ICompanyShareCapital): ICompanyShareCapital {
    return {
      amount: cap.amount,
      currency: cap.currency ? this.sanitizeString(cap.currency) : null,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyNafApe.
   * FR: Sanitize le sous-document CompanyNafApe.
   */
  private static sanitizeCompanyNafApe(naf: ICompanyNafApe): ICompanyNafApe {
    return {
      code: naf.code ? this.sanitizeString(naf.code) : null,
      activity: naf.activity ? this.sanitizeString(naf.activity) : null,
    };
  }

  /**
   * EN: Sanitize the sub-document CompanyDetails. This method re-applies sanitization on all its fields.
   * FR: Sanitize le sous-document CompanyDetails, en ré-appliquant les sanitize sur tous ses champs.
   */
  private static sanitizeCompanyDetails(details: ICompanyDetails): ICompanyDetails {
    return {
      clients: details.clients ? this.sanitizeStringArray(details.clients) : null,
      creation_date: details.creation_date, // Date -> pas de sanitisation HTML/JS
      description: details.description ? this.sanitizeString(details.description) : null,
      global_workforce: details.global_workforce,
      leadership:
        Array.isArray(details.leadership) && details.leadership
          ? details.leadership.map((lead) => this.sanitizeCompanyLeadership(lead))
          : null,
      legal_form: details.legal_form ? this.sanitizeString(details.legal_form) : null,
      locations:
        Array.isArray(details.locations) && details.locations
          ? details.locations.map((loc) => this.sanitizeCompanyLocation(loc))
          : null,
      logo: details.logo ? this.sanitizeString(details.logo) : null,
      market_positioning:
        details.market_positioning
          ? this.sanitizeCompanyMarketPositioning(details.market_positioning)
          : null,
      products: details.products ? this.sanitizeStringArray(details.products) : null,
      revenue:
        Array.isArray(details.revenue) && details.revenue
          ? details.revenue.map((r) => this.sanitizeCompanyCA(r))
          : null,
      share_capital:
        details.share_capital
          ? this.sanitizeCompanyShareCapital(details.share_capital)
          : null,
      siren: details.siren ? this.sanitizeString(details.siren) : null,
      naf_ape:
        details.naf_ape ? this.sanitizeCompanyNafApe(details.naf_ape) : null,
      website: details.website ? this.sanitizeString(details.website) : null,
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
      output.collective_agreement =
        input.collective_agreement !== null
          ? this.sanitizeString(input.collective_agreement)
          : null;
    }

    if (input.company !== undefined) {
      output.company = input.company
        ? this.sanitizeString(input.company)
        : null;
    }

    if (input.company_details !== undefined) {
      output.company_details = input.company_details
        ? this.sanitizeCompanyDetails(input.company_details)
        : null;
    }

    if (input.contract_type !== undefined) {
      output.contract_type = input.contract_type
        ? this.sanitizeString(input.contract_type)
        : null;
    }

    if (input.date !== undefined) {
      output.date = input.date
        ? this.sanitizeString(input.date)
        : null;
    }

    if (input.description !== undefined) {
      output.description = input.description
        ? this.sanitizeString(input.description)
        : null;
    }

    if (input.interest_indicator !== undefined) {
      output.interest_indicator = input.interest_indicator
        ? this.sanitizeString(input.interest_indicator)
        : undefined;
    }

    if (input.language !== undefined) {
      output.language = input.language
        ? this.sanitizeString(input.language)
        : null;
    }

    if (input.level !== undefined) {
      output.level = input.level
        ? this.sanitizeString(input.level)
        : null;
    }

    if (input.location !== undefined) {
      output.location = input.location
        ? this.sanitizeString(input.location)
        : null;
    }

    if (input.methodologies !== undefined) {
      output.methodologies = Array.isArray(input.methodologies)
        ? this.sanitizeStringArray(input.methodologies)
        : null;
    }

    if (input.motivation_letter !== undefined) {
      output.motivation_letter = input.motivation_letter
        ? this.sanitizeString(input.motivation_letter)
        : null;
    }

    if (input.motivation_email !== undefined) {
      output.motivation_email = input.motivation_email
        ? this.sanitizeString(input.motivation_email)
        : null;
    }

    if (input.original_job_id !== undefined) {
      output.original_job_id = input.original_job_id
        ? this.sanitizeString(input.original_job_id)
        : null;
    }

    if (input.preference !== undefined) {
      output.preference = this.sanitizePreference(input.preference);
    }

    if (input.salary !== undefined) {
      output.salary = input.salary
        ? this.sanitizeSalary(input.salary)
        : undefined;
    }

    if (input.source !== undefined) {
      output.source = input.source
        ? this.sanitizeString(input.source)
        : undefined;
    }

    if (input.technologies !== undefined) {
      output.technologies = Array.isArray(input.technologies)
        ? this.sanitizeStringArray(input.technologies)
        : null;
    }

    if (input.teleworking !== undefined) {
      output.teleworking = !!input.teleworking;
    }

    if (input.title !== undefined) {
      output.title = input.title
        ? this.sanitizeString(input.title)
        : undefined;
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
      contract_type: output.contract_type || null,
      date: output.date || null,
      description: output.description || null,
      interest_indicator: output.interest_indicator || null,
      language: output.language || null,
      level: output.level || null,
      location: output.location || null,
      methodologies: output.methodologies || null,
      motivation_letter: output.motivation_letter || null,
      motivation_email: output.motivation_email || null,
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
