export function parseOpenApiResponse(params: any) {
    const { options: { paths }, url, verb } = params;

    try {
      const parameters: any[] = [];
      let rootPath = url;
      if (url.includes('me/drive')) {
        rootPath = url.substring(3);
      }

      const root = paths[`/${rootPath}`];
      const verbContent = root[`${verb}`];
      const queryParams = verbContent.parameters;
      if (queryParams.length > 0) {
        queryParams.forEach((param: any) => {
          if (param.name) {
            const parameter = {
              name: param.name,
              items: param.items.enum || null
            };
            parameters.push(parameter);
          }
        });
      }
      return { url, parameters, verb };
    } catch (error) {
      return { error };
    }
  }