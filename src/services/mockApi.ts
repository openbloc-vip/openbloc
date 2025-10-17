import { faker } from '@faker-js/faker';
import { User, Boulder, UserRole, Gender, Category, Difficulty, BoulderColor } from '../types';

const DIFFICULTIES: Difficulty[] = ['Molt Fàcil', 'Fàcil', 'Mitjà', 'Difícil'];
const COLORS: BoulderColor[] = ['green', 'blue', 'yellow', 'red', 'purple', 'black'];
const GENDERS: Gender[] = ['Masculí', 'Femení'];
const CATEGORIES: Category[] = ['Universitaris', 'Absoluta', 'Sub-18'];

const getPoints = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'Molt Fàcil': return 1;
    case 'Fàcil': return 2;
    case 'Mitjà': return 5;
    case 'Difícil': return 10;
    default: return 0;
  }
};

// --- DATA GENERATION ---
const createRandomBoulder = (id: number): Boulder => {
  const difficulty = faker.helpers.arrayElement(DIFFICULTIES);
  return {
    id: `boulder-${id}`,
    number: id,
    color: faker.helpers.arrayElement(COLORS),
    difficulty: difficulty,
    points: getPoints(difficulty),
  };
};

const createRandomUser = (id: number, role: UserRole, allBoulders: Boulder[]): User => {
  const completedCount = role === 'ADMIN' ? 0 : faker.number.int({ min: 0, max: 20 });
  const completedBoulders = faker.helpers.shuffle(allBoulders).slice(0, completedCount).map(b => b.id);
  
  return {
    id: `user-${id}`,
    email: role === 'ADMIN' ? 'admin@climb.com' : faker.internet.email(),
    password: 'password123',
    name: faker.person.fullName(),
    bib: 100 + id,
    role,
    gender: faker.helpers.arrayElement(GENDERS),
    category: faker.helpers.arrayElement(CATEGORIES),
    completedBoulders,
  };
};

// --- LOCAL STORAGE SIMULATION ---
class LocalStorageDB {
  private boulders: Boulder[] = [];
  private users: User[] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    let boulders = JSON.parse(localStorage.getItem('boulders') || 'null');
    let users = JSON.parse(localStorage.getItem('users') || 'null');

    if (!boulders || boulders.length === 0) {
      boulders = Array.from({ length: 40 }, (_, i) => createRandomBoulder(i + 1));
      localStorage.setItem('boulders', JSON.stringify(boulders));
    }

    if (!users || users.length === 0) {
      const admin = createRandomUser(0, 'ADMIN', boulders);
      users = [admin, ...Array.from({ length: 50 }, (_, i) => createRandomUser(i + 1, 'PARTICIPANT', boulders))];
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    this.boulders = boulders;
    this.users = users;
  }

  // --- PUBLIC API ---
  public getUsers = (): User[] => this.users;
  public getBoulders = (): Boulder[] => this.boulders;

  public updateUser = (updatedUser: User): User => {
    this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(this.users));
    return updatedUser;
  }

  public addBoulder = (boulderData: Omit<Boulder, 'id' | 'number'>): Boulder => {
    const newBoulder: Boulder = {
        ...boulderData,
        id: `boulder-${this.boulders.length + 1}`,
        number: this.boulders.length + 1,
    };
    this.boulders.push(newBoulder);
    localStorage.setItem('boulders', JSON.stringify(this.boulders));
    return newBoulder;
  }

  public updateBoulder = (updatedBoulder: Boulder): Boulder => {
    this.boulders = this.boulders.map(b => b.id === updatedBoulder.id ? updatedBoulder : b);
    localStorage.setItem('boulders', JSON.stringify(this.boulders));
    return updatedBoulder;
  }
}

export const db = new LocalStorageDB();
