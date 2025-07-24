@Post("create")
createCampaign(@Body() body: { name: string; description: string; instructions: string; influencerIds: string[] }) {
  const campaignData = {
    ...body,
    submissions: body.influencerIds.map(influencerId => ({ influencerId, url: '', status: 'pending' })),
  };
  return this.campaignService.createCampaign(campaignData);
} 