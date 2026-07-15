export const CommandService = {
  broadcast: async (_message: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 400));
  },
  deploy: async (_teamId: string, _location: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 400));
  },
  resolve: async (_incidentId: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 400));
  }
};
