export interface DistrictData {
  economicScore: number;
  healthIndex: number;
  activeTrainees: number;
  employmentRate: number;
  topSector: string;
  projectedLaborDemand: number;
  fundsDisbursed: number;
  roiMultiplier: number;
}

export const districtDataMap: Record<string, DistrictData> = {
  Dhaka: {
    economicScore: 95,
    healthIndex: 88,
    activeTrainees: 14500,
    employmentRate: 86,
    topSector: 'IT & Services',
    projectedLaborDemand: 16000,
    fundsDisbursed: 25000000,
    roiMultiplier: 2.1,
  },
  Gazipur: {
    economicScore: 88,
    healthIndex: 76,
    activeTrainees: 18200,
    employmentRate: 89,
    topSector: 'RMG & Textiles',
    projectedLaborDemand: 17500,
    fundsDisbursed: 18000000,
    roiMultiplier: 1.8,
  },
  Narayanganj: {
    economicScore: 90,
    healthIndex: 75,
    activeTrainees: 15400,
    employmentRate: 87,
    topSector: 'RMG & Textiles',
    projectedLaborDemand: 14000,
    fundsDisbursed: 15000000,
    roiMultiplier: 1.9,
  },
  Narsingdi: {
    economicScore: 75,
    healthIndex: 68,
    activeTrainees: 8200,
    employmentRate: 74,
    topSector: 'Light Engineering',
    projectedLaborDemand: 9000,
    fundsDisbursed: 8500000,
    roiMultiplier: 1.4,
  },
  Munshiganj: {
    economicScore: 72,
    healthIndex: 70,
    activeTrainees: 5100,
    employmentRate: 72,
    topSector: 'Agriculture',
    projectedLaborDemand: 5500,
    fundsDisbursed: 6000000,
    roiMultiplier: 1.2,
  },
  Manikganj: {
    economicScore: 65,
    healthIndex: 62,
    activeTrainees: 4800,
    employmentRate: 68,
    topSector: 'Agriculture',
    projectedLaborDemand: 5000,
    fundsDisbursed: 5500000,
    roiMultiplier: 1.1,
  },
  Tangail: {
    economicScore: 68,
    healthIndex: 65,
    activeTrainees: 7500,
    employmentRate: 70,
    topSector: 'Handicrafts & Loom',
    projectedLaborDemand: 7000,
    fundsDisbursed: 7000000,
    roiMultiplier: 1.3,
  },
  Kishoreganj: {
    economicScore: 38,
    healthIndex: 45,
    activeTrainees: 3200,
    employmentRate: 52,
    topSector: 'Agro-Fisheries',
    projectedLaborDemand: 4500,
    fundsDisbursed: 4000000,
    roiMultiplier: 0.8,
  },
  Faridpur: {
    economicScore: 62,
    healthIndex: 60,
    activeTrainees: 5500,
    employmentRate: 65,
    topSector: 'Agriculture',
    projectedLaborDemand: 6000,
    fundsDisbursed: 5000000,
    roiMultiplier: 1.1,
  },
  Gopalganj: {
    economicScore: 55,
    healthIndex: 58,
    activeTrainees: 4100,
    employmentRate: 60,
    topSector: 'Agro-Tech',
    projectedLaborDemand: 4500,
    fundsDisbursed: 4500000,
    roiMultiplier: 1.0,
  },
  Madaripur: {
    economicScore: 48,
    healthIndex: 52,
    activeTrainees: 3800,
    employmentRate: 55,
    topSector: 'Logistics',
    projectedLaborDemand: 4000,
    fundsDisbursed: 3500000,
    roiMultiplier: 0.9,
  },
  Rajbari: {
    economicScore: 42,
    healthIndex: 50,
    activeTrainees: 2900,
    employmentRate: 54,
    topSector: 'Agriculture',
    projectedLaborDemand: 3500,
    fundsDisbursed: 3000000,
    roiMultiplier: 0.85,
  },
  Shariatpur: {
    economicScore: 40,
    healthIndex: 48,
    activeTrainees: 2700,
    employmentRate: 51,
    topSector: 'Agriculture',
    projectedLaborDemand: 3000,
    fundsDisbursed: 2800000,
    roiMultiplier: 0.8,
  },

  // --- Chittagong Division ---
  Chittagong: {
    economicScore: 92,
    healthIndex: 82,
    activeTrainees: 16800,
    employmentRate: 85,
    topSector: 'Port & Heavy Industry',
    projectedLaborDemand: 18000,
    fundsDisbursed: 22000000,
    roiMultiplier: 2.0,
  },
  "Cox's Bazar": {
    economicScore: 75,
    healthIndex: 60,
    activeTrainees: 8900,
    employmentRate: 72,
    topSector: 'Tourism & Hospitality',
    projectedLaborDemand: 8000,
    fundsDisbursed: 10000000,
    roiMultiplier: 1.5,
  },
  Comilla: {
    economicScore: 82,
    healthIndex: 74,
    activeTrainees: 9200,
    employmentRate: 78,
    topSector: 'Light Engineering',
    projectedLaborDemand: 10000,
    fundsDisbursed: 11000000,
    roiMultiplier: 1.6,
  },
  Feni: {
    economicScore: 78,
    healthIndex: 70,
    activeTrainees: 5400,
    employmentRate: 75,
    topSector: 'Retail & Services',
    projectedLaborDemand: 5500,
    fundsDisbursed: 6500000,
    roiMultiplier: 1.4,
  },
  Noakhali: {
    economicScore: 68,
    healthIndex: 62,
    activeTrainees: 6100,
    employmentRate: 66,
    topSector: 'Agro-Tech',
    projectedLaborDemand: 6500,
    fundsDisbursed: 7000000,
    roiMultiplier: 1.2,
  },
  Lakshmipur: {
    economicScore: 55,
    healthIndex: 54,
    activeTrainees: 3800,
    employmentRate: 58,
    topSector: 'Agriculture',
    projectedLaborDemand: 4200,
    fundsDisbursed: 4500000,
    roiMultiplier: 1.0,
  },
  Chandpur: {
    economicScore: 60,
    healthIndex: 58,
    activeTrainees: 4500,
    employmentRate: 62,
    topSector: 'Fisheries',
    projectedLaborDemand: 4800,
    fundsDisbursed: 5000000,
    roiMultiplier: 1.1,
  },
  Brahmanbaria: {
    economicScore: 58,
    healthIndex: 55,
    activeTrainees: 4200,
    employmentRate: 60,
    topSector: 'Agriculture',
    projectedLaborDemand: 4500,
    fundsDisbursed: 4800000,
    roiMultiplier: 1.0,
  },
  Brahamanbaria: {
    economicScore: 58,
    healthIndex: 55,
    activeTrainees: 4200,
    employmentRate: 60,
    topSector: 'Agriculture',
    projectedLaborDemand: 4500,
    fundsDisbursed: 4800000,
    roiMultiplier: 1.0,
  }, // Spelling variation addition
  Khagrachhari: {
    economicScore: 28,
    healthIndex: 35,
    activeTrainees: 1200,
    employmentRate: 40,
    topSector: 'Agro-Forestry',
    projectedLaborDemand: 2000,
    fundsDisbursed: 2000000,
    roiMultiplier: 0.6,
  },
  Rangamati: {
    economicScore: 32,
    healthIndex: 38,
    activeTrainees: 1500,
    employmentRate: 42,
    topSector: 'Handicrafts',
    projectedLaborDemand: 1800,
    fundsDisbursed: 2200000,
    roiMultiplier: 0.7,
  },
  Bandarban: {
    economicScore: 25,
    healthIndex: 30,
    activeTrainees: 900,
    employmentRate: 35,
    topSector: 'Agro-Forestry',
    projectedLaborDemand: 1500,
    fundsDisbursed: 1800000,
    roiMultiplier: 0.5,
  },

  // --- Sylhet Division ---
  Sylhet: {
    economicScore: 85,
    healthIndex: 78,
    activeTrainees: 8500,
    employmentRate: 76,
    topSector: 'Tourism & Services',
    projectedLaborDemand: 9000,
    fundsDisbursed: 12000000,
    roiMultiplier: 1.7,
  },
  Moulvibazar: {
    economicScore: 72,
    healthIndex: 68,
    activeTrainees: 4200,
    employmentRate: 70,
    topSector: 'Tea Estate & Agro',
    projectedLaborDemand: 4500,
    fundsDisbursed: 5500000,
    roiMultiplier: 1.3,
  },
  Maulvibajar: {
    economicScore: 72,
    healthIndex: 68,
    activeTrainees: 4200,
    employmentRate: 70,
    topSector: 'Tea Estate & Agro',
    projectedLaborDemand: 4500,
    fundsDisbursed: 5500000,
    roiMultiplier: 1.3,
  }, // Spelling variation addition
  Habiganj: {
    economicScore: 60,
    healthIndex: 58,
    activeTrainees: 3800,
    employmentRate: 62,
    topSector: 'Agriculture',
    projectedLaborDemand: 4000,
    fundsDisbursed: 4500000,
    roiMultiplier: 1.1,
  },
  Sunamganj: {
    economicScore: 29,
    healthIndex: 35,
    activeTrainees: 1800,
    employmentRate: 45,
    topSector: 'Fisheries',
    projectedLaborDemand: 3000,
    fundsDisbursed: 3000000,
    roiMultiplier: 0.7,
  },

  // --- Rajshahi Division ---
  Rajshahi: {
    economicScore: 80,
    healthIndex: 75,
    activeTrainees: 9800,
    employmentRate: 74,
    topSector: 'Agro-Processing',
    projectedLaborDemand: 10500,
    fundsDisbursed: 13000000,
    roiMultiplier: 1.6,
  },
  Bogra: {
    economicScore: 82,
    healthIndex: 76,
    activeTrainees: 11200,
    employmentRate: 78,
    topSector: 'Light Engineering',
    projectedLaborDemand: 12000,
    fundsDisbursed: 14000000,
    roiMultiplier: 1.8,
  },
  Pabna: {
    economicScore: 72,
    healthIndex: 68,
    activeTrainees: 6500,
    employmentRate: 70,
    topSector: 'Textiles',
    projectedLaborDemand: 6000,
    fundsDisbursed: 8000000,
    roiMultiplier: 1.2,
  },
  Sirajganj: {
    economicScore: 48,
    healthIndex: 50,
    activeTrainees: 3500,
    employmentRate: 55,
    topSector: 'Handloom',
    projectedLaborDemand: 3000,
    fundsDisbursed: 4000000,
    roiMultiplier: 0.8,
  },
  Naogaon: {
    economicScore: 65,
    healthIndex: 60,
    activeTrainees: 4800,
    employmentRate: 65,
    topSector: 'Agriculture',
    projectedLaborDemand: 5200,
    fundsDisbursed: 5500000,
    roiMultiplier: 1.1,
  },
  Natore: {
    economicScore: 58,
    healthIndex: 55,
    activeTrainees: 3900,
    employmentRate: 60,
    topSector: 'Agro-Processing',
    projectedLaborDemand: 4200,
    fundsDisbursed: 4800000,
    roiMultiplier: 1.0,
  },
  Chapainawabganj: {
    economicScore: 35,
    healthIndex: 40,
    activeTrainees: 2200,
    employmentRate: 48,
    topSector: 'Agriculture',
    projectedLaborDemand: 3000,
    fundsDisbursed: 3000000,
    roiMultiplier: 0.7,
  },
  Nawabganj: {
    economicScore: 35,
    healthIndex: 40,
    activeTrainees: 2200,
    employmentRate: 48,
    topSector: 'Agriculture',
    projectedLaborDemand: 3000,
    fundsDisbursed: 3000000,
    roiMultiplier: 0.7,
  }, // Spelling variation addition
  Joypurhat: {
    economicScore: 52,
    healthIndex: 54,
    activeTrainees: 3100,
    employmentRate: 58,
    topSector: 'Poultry & Agro',
    projectedLaborDemand: 3500,
    fundsDisbursed: 3800000,
    roiMultiplier: 0.9,
  },

  // --- Khulna Division ---
  Khulna: {
    economicScore: 84,
    healthIndex: 78,
    activeTrainees: 10500,
    employmentRate: 80,
    topSector: 'Shrimp & Export',
    projectedLaborDemand: 11000,
    fundsDisbursed: 14000000,
    roiMultiplier: 1.7,
  },
  Jessore: {
    economicScore: 78,
    healthIndex: 72,
    activeTrainees: 8800,
    employmentRate: 76,
    topSector: 'Automotive & Tech',
    projectedLaborDemand: 9500,
    fundsDisbursed: 11000000,
    roiMultiplier: 1.5,
  },
  Kushtia: {
    economicScore: 72,
    healthIndex: 68,
    activeTrainees: 6200,
    employmentRate: 72,
    topSector: 'Agriculture',
    projectedLaborDemand: 6800,
    fundsDisbursed: 8000000,
    roiMultiplier: 1.3,
  },
  Jhenaidah: {
    economicScore: 62,
    healthIndex: 60,
    activeTrainees: 4500,
    employmentRate: 65,
    topSector: 'Agriculture',
    projectedLaborDemand: 5000,
    fundsDisbursed: 5500000,
    roiMultiplier: 1.1,
  },
  Chuadanga: {
    economicScore: 55,
    healthIndex: 54,
    activeTrainees: 3800,
    employmentRate: 60,
    topSector: 'Agriculture',
    projectedLaborDemand: 4000,
    fundsDisbursed: 4500000,
    roiMultiplier: 1.0,
  },
  Meherpur: {
    economicScore: 45,
    healthIndex: 48,
    activeTrainees: 2500,
    employmentRate: 52,
    topSector: 'Agriculture',
    projectedLaborDemand: 3000,
    fundsDisbursed: 3200000,
    roiMultiplier: 0.8,
  },
  Magura: {
    economicScore: 50,
    healthIndex: 52,
    activeTrainees: 3100,
    employmentRate: 58,
    topSector: 'Agriculture',
    projectedLaborDemand: 3500,
    fundsDisbursed: 3800000,
    roiMultiplier: 0.9,
  },
  Narail: {
    economicScore: 48,
    healthIndex: 50,
    activeTrainees: 2800,
    employmentRate: 55,
    topSector: 'Agriculture',
    projectedLaborDemand: 3200,
    fundsDisbursed: 3500000,
    roiMultiplier: 0.85,
  },
  Bagerhat: {
    economicScore: 42,
    healthIndex: 45,
    activeTrainees: 2200,
    employmentRate: 50,
    topSector: 'Fisheries',
    projectedLaborDemand: 2800,
    fundsDisbursed: 3000000,
    roiMultiplier: 0.8,
  },
  Satkhira: {
    economicScore: 38,
    healthIndex: 40,
    activeTrainees: 2600,
    employmentRate: 48,
    topSector: 'Fisheries',
    projectedLaborDemand: 3500,
    fundsDisbursed: 3500000,
    roiMultiplier: 0.75,
  },

  // --- Barisal Division ---
  Barisal: {
    economicScore: 72,
    healthIndex: 68,
    activeTrainees: 7500,
    employmentRate: 70,
    topSector: 'Riverine Trade & Tech',
    projectedLaborDemand: 8000,
    fundsDisbursed: 9000000,
    roiMultiplier: 1.2,
  },
  Patuakhali: {
    economicScore: 45,
    healthIndex: 48,
    activeTrainees: 3200,
    employmentRate: 54,
    topSector: 'Fisheries',
    projectedLaborDemand: 4000,
    fundsDisbursed: 4500000,
    roiMultiplier: 0.85,
  },
  Bhola: {
    economicScore: 38,
    healthIndex: 42,
    activeTrainees: 2800,
    employmentRate: 50,
    topSector: 'Fisheries',
    projectedLaborDemand: 3500,
    fundsDisbursed: 4000000,
    roiMultiplier: 0.7,
  },
  Pirojpur: {
    economicScore: 52,
    healthIndex: 55,
    activeTrainees: 3500,
    employmentRate: 60,
    topSector: 'Agriculture',
    projectedLaborDemand: 4000,
    fundsDisbursed: 4500000,
    roiMultiplier: 0.95,
  },
  Barguna: {
    economicScore: 28,
    healthIndex: 35,
    activeTrainees: 1500,
    employmentRate: 40,
    topSector: 'Fisheries',
    projectedLaborDemand: 2500,
    fundsDisbursed: 2500000,
    roiMultiplier: 0.6,
  },
  Jhalokati: {
    economicScore: 48,
    healthIndex: 52,
    activeTrainees: 2900,
    employmentRate: 55,
    topSector: 'Agriculture',
    projectedLaborDemand: 3500,
    fundsDisbursed: 3800000,
    roiMultiplier: 0.85,
  },

  // --- Rangpur Division ---
  Rangpur: {
    economicScore: 65,
    healthIndex: 62,
    activeTrainees: 6800,
    employmentRate: 65,
    topSector: 'Tobacco & Agro',
    projectedLaborDemand: 7500,
    fundsDisbursed: 8000000,
    roiMultiplier: 1.1,
  },
  Dinajpur: {
    economicScore: 68,
    healthIndex: 65,
    activeTrainees: 7200,
    employmentRate: 68,
    topSector: 'Agriculture',
    projectedLaborDemand: 8000,
    fundsDisbursed: 8500000,
    roiMultiplier: 1.15,
  },
  Thakurgaon: {
    economicScore: 42,
    healthIndex: 48,
    activeTrainees: 3100,
    employmentRate: 52,
    topSector: 'Agriculture',
    projectedLaborDemand: 4000,
    fundsDisbursed: 4500000,
    roiMultiplier: 0.8,
  },
  Panchagarh: {
    economicScore: 45,
    healthIndex: 50,
    activeTrainees: 3400,
    employmentRate: 54,
    topSector: 'Tea & Agro',
    projectedLaborDemand: 4200,
    fundsDisbursed: 4800000,
    roiMultiplier: 0.85,
  },
  Nilphamari: {
    economicScore: 35,
    healthIndex: 42,
    activeTrainees: 2800,
    employmentRate: 48,
    topSector: 'Agriculture',
    projectedLaborDemand: 3800,
    fundsDisbursed: 4000000,
    roiMultiplier: 0.7,
  },
  Gaibandha: {
    economicScore: 26,
    healthIndex: 32,
    activeTrainees: 1900,
    employmentRate: 42,
    topSector: 'Agriculture',
    projectedLaborDemand: 3000,
    fundsDisbursed: 3200000,
    roiMultiplier: 0.5,
  },
  Kurigram: {
    economicScore: 18,
    healthIndex: 28,
    activeTrainees: 1200,
    employmentRate: 35,
    topSector: 'Handicrafts',
    projectedLaborDemand: 2500,
    fundsDisbursed: 2500000,
    roiMultiplier: 0.4,
  },
  Lalmonirhat: {
    economicScore: 29,
    healthIndex: 36,
    activeTrainees: 2100,
    employmentRate: 45,
    topSector: 'Agriculture',
    projectedLaborDemand: 3000,
    fundsDisbursed: 3000000,
    roiMultiplier: 0.6,
  },

  // --- Mymensingh Division ---
  Mymensingh: {
    economicScore: 72,
    healthIndex: 68,
    activeTrainees: 8200,
    employmentRate: 70,
    topSector: 'Agro-Tech',
    projectedLaborDemand: 9000,
    fundsDisbursed: 9500000,
    roiMultiplier: 1.2,
  },
  Jamalpur: {
    economicScore: 38,
    healthIndex: 44,
    activeTrainees: 3500,
    employmentRate: 50,
    topSector: 'Agriculture',
    projectedLaborDemand: 4500,
    fundsDisbursed: 4500000,
    roiMultiplier: 0.75,
  },
  Sherpur: {
    economicScore: 32,
    healthIndex: 40,
    activeTrainees: 2800,
    employmentRate: 46,
    topSector: 'Agriculture',
    projectedLaborDemand: 3800,
    fundsDisbursed: 3800000,
    roiMultiplier: 0.65,
  },
  Netrokona: {
    economicScore: 27,
    healthIndex: 35,
    activeTrainees: 2200,
    employmentRate: 42,
    topSector: 'Fisheries',
    projectedLaborDemand: 3000,
    fundsDisbursed: 3200000,
    roiMultiplier: 0.55,
  },
  Netrakona: {
    economicScore: 27,
    healthIndex: 35,
    activeTrainees: 2200,
    employmentRate: 42,
    topSector: 'Fisheries',
    projectedLaborDemand: 3000,
    fundsDisbursed: 3200000,
    roiMultiplier: 0.55,
  }, // Spelling variation addition
};

const getDetailLinkHtml = (districtName: string) => `
  <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dotted var(--mantine-color-default-border); text-align: center;">
    <a href="/admin/stat/district/${encodeURIComponent(districtName)}" style="color: var(--mantine-color-blue-filled); font-size: 0.85rem; font-weight: 600; text-decoration: none; cursor: pointer;">
      View District Details &rarr;
    </a>
  </div>
`;
export type MapType = 'economy' | 'mismatch' | 'health' | 'roi';

export const mapConfigs = {
  economy: {
    getValue: (data: DistrictData) => {
      return data.economicScore;
    },
    getColor: (value: number, isDark: boolean) => {
      let fillColor = isDark ? 'var(--mantine-color-yellow-8)' : 'var(--mantine-color-yellow-5)';

      if (value > 70) {
        fillColor = isDark ? 'var(--mantine-color-green-8)' : 'var(--mantine-color-green-5)';
      } else if (value < 30) {
        fillColor = isDark ? 'var(--mantine-color-red-8)' : 'var(--mantine-color-red-5)';
      } else if (value < 50) {
        fillColor = isDark ? 'var(--mantine-color-orange-8)' : 'var(--mantine-color-orange-5)';
      }

      return fillColor;
    },
    getTooltip: (name: string, data: DistrictData) => {
      return `
      <div style="font-family: sans-serif; min-width: 180px; color: var(--mantine-color-text);">
        <h4 style="margin: 0 0 8px 0; border-bottom: 1px solid var(--mantine-color-default-border); padding-bottom: 4px;">${name} District</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--mantine-color-dimmed);">Economic Score:</span><strong>${data.economicScore}/100</strong></div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--mantine-color-dimmed);">Top Sector:</span><strong style="color: var(--mantine-color-blue-filled);">${data.topSector}</strong></div>
        ${getDetailLinkHtml(name)}      </div>`;
    },
  },

  mismatch: {
    getValue: (data: DistrictData) => {
      return (data.activeTrainees / data.projectedLaborDemand) * 100;
    },
    getColor: (value: number, isDark: boolean) => {
      if (Math.floor(value) > 110) {
        return isDark ? 'var(--mantine-color-red-9)' : 'var(--mantine-color-red-6)';
      } else if (value >= 90) {
        return isDark ? 'var(--mantine-color-teal-8)' : 'var(--mantine-color-teal-5)';
      }
      return isDark ? 'var(--mantine-color-blue-9)' : 'var(--mantine-color-blue-5)';
    },
    getTooltip: (name: string, data: DistrictData) => {
      const matchPct = Math.round((data.activeTrainees / data.projectedLaborDemand) * 100);
      let status = '';

      if (matchPct > 110) {
        status = '<span style="color: var(--mantine-color-red-filled)">Oversupply Warning</span>';
      } else if (matchPct >= 90) {
        status = '<span style="color: var(--mantine-color-teal-filled)">Market Balanced</span>';
      } else {
        status = '<span style="color: var(--mantine-color-blue-filled)">Labor Shortage</span>';
      }

      return `
      <div style="font-family: sans-serif; min-width: 200px; color: var(--mantine-color-text);">
        <h4 style="margin: 0 0 8px 0; border-bottom: 1px solid var(--mantine-color-default-border); padding-bottom: 4px;">${name}: Labor Demand</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--mantine-color-dimmed);">Pipeline Supply:</span><strong>${data.activeTrainees.toLocaleString()}</strong></div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--mantine-color-dimmed);">Industry Demand:</span><strong>${data.projectedLaborDemand.toLocaleString()}</strong></div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; border-top: 1px dotted var(--mantine-color-default-border); padding-top: 4px;"><span style="color: var(--mantine-color-dimmed);">Status:</span><strong>${status} (${matchPct}%)</strong></div>
${getDetailLinkHtml(name)} 
      </div>`;
    },
  },

  health: {
    getValue: (data: DistrictData) => {
      return data.healthIndex;
    },
    getColor: (value: number, isDark: boolean) => {
      if (value >= 65) {
        return isDark ? 'var(--mantine-color-cyan-8)' : 'var(--mantine-color-cyan-5)';
      } else if (value >= 45) {
        return isDark ? 'var(--mantine-color-orange-8)' : 'var(--mantine-color-orange-5)';
      }
      return isDark ? 'var(--mantine-color-red-9)' : 'var(--mantine-color-red-6)';
    },
    getTooltip: (name: string, data: DistrictData) => {
      return `
      <div style="font-family: sans-serif; min-width: 180px; color: var(--mantine-color-text);">
        <h4 style="margin: 0 0 8px 0; border-bottom: 1px solid var(--mantine-color-default-border); padding-bottom: 4px;">${name}: Health Pulse</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--mantine-color-dimmed);">Health Index:</span><strong>${data.healthIndex}/100</strong></div>
${getDetailLinkHtml(name)} 
      </div>`;
    },
  },

  roi: {
    getValue: (data: DistrictData) => {
      return data.roiMultiplier;
    },
    getColor: (value: number, isDark: boolean) => {
      if (value >= 1.5) {
        return isDark ? 'var(--mantine-color-emerald-8)' : 'var(--mantine-color-green-5)';
      } else if (value >= 1.0) {
        return isDark ? 'var(--mantine-color-lime-9)' : 'var(--mantine-color-lime-4)';
      }
      return isDark ? 'var(--mantine-color-pink-9)' : 'var(--mantine-color-pink-6)';
    },
    getTooltip: (name: string, data: DistrictData) => {
      const returnColor =
        data.roiMultiplier >= 1.0
          ? 'var(--mantine-color-green-filled)'
          : 'var(--mantine-color-red-filled)';
      return `
      <div style="font-family: sans-serif; min-width: 220px; color: var(--mantine-color-text);">
        <h4 style="margin: 0 0 8px 0; border-bottom: 1px solid var(--mantine-color-default-border); padding-bottom: 4px;">${name}: Fund Efficiency</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--mantine-color-dimmed);">Funds Disbursed:</span><strong>৳ ${(data.fundsDisbursed / 1000000).toFixed(1)}M</strong></div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--mantine-color-dimmed);">Economic Return:</span><strong style="color: ${returnColor}">${data.roiMultiplier}x</strong></div>
		${getDetailLinkHtml(name)} 
      </div>`;
    },
  },
};
