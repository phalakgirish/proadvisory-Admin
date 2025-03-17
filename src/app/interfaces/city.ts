export interface City {
    id(id: any): unknown;
    _id?: string;  
    cname: string;  
    status: 'active' | 'inactive'; 
  }
  