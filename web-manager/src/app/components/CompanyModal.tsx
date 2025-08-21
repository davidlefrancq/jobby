'use client';

import { ICompanyDetails } from "@/types/IJobEntity";
import { CloseButton } from "./Btn/CloseButton";
import Image from "next/image";

interface IDisplayBannerProps {
  data: ICompanyDetails | null;
  onClose: () => void;
}

export default function CompanyModal({ data, onClose }: IDisplayBannerProps) {
  if (!data) return null;

  return (
    // Overlay modal
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Container modal */}
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-3xl max-h-[90vh] flex flex-col">
        {/* En-tête */}
        <header className="rounded-xl sticky top-0 bg-white flex items-center px-6 py-4 z-10">
          <div className="w-full pb-3 flex items-center border-b">
          {data.logo ? (
            <Image
              src={data.logo}
              priority={false}
              alt="Logo de l’entreprise"
              className="h-12 w-12 object-contain mr-4"
            />
          ) : (
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              {/* TODO : SVG Logo placeholder */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
              </svg>
            </div>
          )}
          <h2 className="text-2xl font-semibold text-gray-800">Détails de l’entreprise</h2>
          <CloseButton onClick={onClose} className="ml-2" />
          </div>
        </header>

        {/* Contenu scrollable */}
        <div className="px-6 py-4 space-y-6 overflow-y-auto">
          {/* Informations générales */}
          <section>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Informations générales</h3>
            <div className="space-y-1 text-gray-600">
              {data.creation_date && (
                <div>
                  <strong className="font-semibold">Date de création :</strong>
                  <span className="ml-1">
                    {new Date(data.creation_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              {data.legal_form && (
                <div>
                  <strong className="font-semibold">Forme juridique :</strong>
                  <span className="ml-1">{data.legal_form}</span>
                </div>
              )}
              {data.description && (
                <div>
                  <strong className="font-semibold">Description :</strong>
                  <p className="mt-1">{data.description}</p>
                </div>
              )}
              {data.sector && (
                <div>
                  <strong className="font-semibold">Secteur :</strong>
                  <span className="ml-1">{data.sector}</span>
                </div>
              )}
              {data.global_workforce != null && (
                <div>
                  <strong className="font-semibold">Effectif :</strong>
                  <span className="ml-1">{data.global_workforce}</span>
                </div>
              )}
              {data.website && (
                <div>
                  <strong className="font-semibold">Site web :</strong>
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-600 hover:underline"
                  >
                    {data.website}
                  </a>
                </div>
              )}
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Chiffres clés */}
          <section>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Chiffres clés</h3>
            <div className="space-y-1 text-gray-600">
              {data.share_capital && (
                <div>
                  <strong className="font-semibold">Capital social :</strong>
                  <span className="ml-1">
                    {data.share_capital.amount.toLocaleString()} {data.share_capital.currency}
                  </span>
                </div>
              )}
              {data.revenue && (
                <div>
                  <strong className="font-semibold">Chiffre d’affaires :</strong>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {data.revenue.map(item => (
                      <li key={item.year}>
                        {item.year} : {item.amount} {item.currency}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Direction */}
          <section>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Direction</h3>
            {data.leadership ? (
              <ul className="space-y-4 text-gray-600">
                {data.leadership.map(member => (
                  <li key={member.name} className="border rounded-lg p-3">
                    <p className="font-semibold">{member.name} – <span className="font-normal">{member.position}</span></p>
                    <div className="mt-1 space-y-1">
                      {member.email && (
                        <p>
                          Email: 
                          <a
                            href={`mailto:${member.email}`}
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            {member.email}
                          </a>
                        </p>
                      )}
                      {member.phone && <p>Téléphone: <span className="ml-1">{member.phone}</span></p>}
                      {member.linkedin && (
                        <p>
                          LinkedIn: 
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            {member.linkedin}
                          </a>
                        </p>
                      )}
                      {member.github && (
                        <p>
                          GitHub: 
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            {member.github}
                          </a>
                        </p>
                      )}
                      {member.twitter && (
                        <p>
                          Twitter: 
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            {member.twitter}
                          </a>
                        </p>
                      )}
                      {member.website && (
                        <p>
                          Site web: 
                          <a
                            href={member.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            {member.website}
                          </a>
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucun responsable renseigné.</p>
            )}
          </section>

          <hr className="border-gray-200" />

          {/* Address */}
          <section>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Adresse(s)</h3>
            {data.locations ? (
              <ul className="space-y-4 text-gray-600">
                {data.locations.map(loc => (
                  <li key={loc.siret} className="border rounded-lg p-3">
                    <p>
                      {loc.address} {loc.postal_code} {loc.city} {loc.country}
                    </p>
                    {loc.workforce != null && loc.workforce > 0 && (
                      <p className="mt-1">
                        <strong>Effectif : </strong>
                        <span>{loc.workforce}</span>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucune localisation renseignée.</p>
            )}
          </section>

          <hr className="border-gray-200" />

          {/* Positionnement Marché */}
          <section>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Positionnement Marché</h3>
            {data.market_positioning ? (
              <div className="space-y-4 text-gray-600">
                {data.market_positioning.differentiators && (
                  <div>
                    <strong className="font-semibold">Différenciateurs :</strong>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      {data.market_positioning.differentiators.map(diff => (
                        <li key={diff}>{diff}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.market_positioning.competitors && (
                  <div>
                    <strong className="font-semibold">Concurrents :</strong>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      {data.market_positioning.competitors.map(comp => (
                        <li key={comp}>{comp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Positionnement marché non renseigné.</p>
            )}
          </section>

          <hr className="border-gray-200" />

          {/* Produits & Clients */}
          <section>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Produits</h3>
            <div className="space-y-4 text-gray-600">
              {data.products ? (
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {data.products.map(prod => (
                    <li key={prod}>{prod}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun produit renseigné.</p>
              )}
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Clients</h3>
            <div className="space-y-4 text-gray-600">
              {data.clients ? (
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {data.clients.map(client => (
                    <li key={client}>{client}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun client renseigné.</p>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 flex justify-end"></footer>
      </div>
    </div>
  );
}