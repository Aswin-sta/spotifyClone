type CategoryResponseType = {
    categories: {
      items: {
        icons: {
          height: number;
          url: string;
          width: number;
        }[];
        id: string;
        name: string;
      }[];
    };
  };
 
  export { CategoryResponseType };