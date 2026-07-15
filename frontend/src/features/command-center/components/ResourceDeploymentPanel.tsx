import React from 'react';
import { ResourceDeploymentWidget } from './ResourceDeploymentWidget';
import { useResources } from '@/features/resources/useResources';
import type { MobileUnit, FloorType } from '@/features/digital-twin/types';

/**
 * ResourceDeploymentPanel — backend-backed container for the Resource Deployment
 * widget. Fetches the roster from `/v1/resources` and adapts it to the widget's
 * existing `MobileUnit[]` prop (the widget only reads `type`/`status`; position
 * is filled with a neutral placeholder). Keeps the widget's visuals unchanged.
 *
 * The live map's own unit positions remain on the digital-twin layer (Phase 3);
 * this panel is the deployment *roster* summary, sourced from the resources
 * collection — the single source of truth for who is deployed.
 */
export const ResourceDeploymentPanel: React.FC = () => {
  const { data } = useResources();

  const units: MobileUnit[] = (data?.units ?? []).map((u) => ({
    id: u.id,
    type: u.type,
    status: u.status,
    floor: u.floor as FloorType,
    position: { lng: 0, lat: 0 },
    lastUpdated: '',
  }));

  return <ResourceDeploymentWidget units={units} />;
};
