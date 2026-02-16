
import { Medicine } from './types';

export const INITIAL_MEDICINES: Medicine[] = [
  // Category-Wise (Main Section)
  { id: 'c1', name: 'Amoxicillin Cap', category: 'Tablets & Capsules', price: 120, stock: 50, requiresPrescription: true, description: 'Antibiotic', usage: '1 cap TDS', sideEffects: 'Nausea' },
  { id: 'c2', name: 'Benadryl Syrup', category: 'Syrups', price: 150, stock: 30, requiresPrescription: false, description: 'Cough syrup', usage: '10ml SOS', sideEffects: 'Drowsiness' },
  { id: 'c3', name: 'Insulin Glargine', category: 'Injections', price: 850, stock: 10, requiresPrescription: true, description: 'Long acting insulin', usage: 'Once daily SC', sideEffects: 'Hypoglycemia' },
  { id: 'c4', name: 'Betadine Ointment', category: 'Oints & Creams', price: 95, stock: 100, requiresPrescription: false, description: 'Antiseptic', usage: 'Apply twice', sideEffects: 'Irritation' },
  
  // Disease / Condition Based
  { id: 'd1', name: 'Dolo 650', condition: 'Fever & Pain Relief', category: 'Tablets & Capsules', price: 30, stock: 200, requiresPrescription: false, description: 'Paracetamol', usage: '1 tab SOS', sideEffects: 'None' },
  { id: 'd2', name: 'Ascoril D', condition: 'Cold & Cough', category: 'Syrups', price: 110, stock: 45, requiresPrescription: false, description: 'Cough suppressant', usage: '5ml TDS', sideEffects: 'Dizziness' },
  { id: 'd3', name: 'Glycomet GP2', condition: 'Diabetes Care', category: 'Tablets & Capsules', price: 210, stock: 60, requiresPrescription: true, description: 'Diabetes control', usage: '1 tab OD', sideEffects: 'Bloating' },
  { id: 'd4', name: 'Telma 40', condition: 'Blood Pressure', category: 'Tablets & Capsules', price: 180, stock: 80, requiresPrescription: true, description: 'BP medicine', usage: '1 tab morning', sideEffects: 'Fatigue' },
  { id: 'd5', name: 'Ecosprin 75', condition: 'Heart Health', category: 'Tablets & Capsules', price: 50, stock: 150, requiresPrescription: true, description: 'Blood thinner', usage: '1 tab OD', sideEffects: 'Bleeding' },

  // Health & Wellness
  { id: 'w1', name: 'Zincovit', isWellness: true, category: 'Vitamins & Supplements', price: 140, stock: 300, requiresPrescription: false, description: 'Multivitamin', usage: '1 tab OD', sideEffects: 'None' },
  { id: 'w2', name: 'Chyawanprash', isWellness: true, category: 'Immunity Boosters', price: 350, stock: 25, requiresPrescription: false, description: 'Ayurvedic tonic', usage: '1 spoon daily', sideEffects: 'None' },
  { id: 'w3', name: 'Whey Protein', isWellness: true, category: 'Protein & Nutrition', price: 2400, stock: 12, requiresPrescription: false, description: 'Muscle support', usage: '1 scoop daily', sideEffects: 'Digestive issues' },
  { id: 'w4', name: 'Ashwagandha', isWellness: true, category: 'Herbal Products', price: 220, stock: 40, requiresPrescription: false, description: 'Stress relief', usage: '1 cap BD', sideEffects: 'None' }
];
