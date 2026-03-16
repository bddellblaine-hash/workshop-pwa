import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadImage = async (file, bucket, path) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return urlData.publicUrl;
};

export const db = {
  async getClients() {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async saveClient(client) {
    const { data, error } = await supabase.from('clients').upsert({
      id: client.id || undefined,
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
      notes: client.notes,
      terms_signed: client.termsSigned,
      terms_date: client.termsDate,
    }).select().single();
    if (error) throw error;
    return data;
  },
  async getJobs() {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async saveJob(job) {
    const { data, error } = await supabase.from('jobs').upsert({
      id: job.id || undefined,
      number: job.number,
      client_name: job.client,
      phone: job.phone,
      email: job.email,
      description: job.description,
      job_type: job.jobType,
      vehicle_make: job.vehicleMake,
      vehicle_model: job.vehicleModel,
      registration: job.registration,
      status: job.status,
      technician: job.technician,
      notes: job.notes,
      labour_hours: job.labourHours,
      sundries_amount: job.sundriesAmount,
      parts: job.parts,
      history: job.history,
      due: job.due,
      images: job.images || [],
      slip_images: job.slipImages || [],
      signature_url: job.signatureUrl || null,
    }).select().single();
    if (error) throw error;
    return data;
  },
  async updateJobStatus(id, status) {
    const { error } = await supabase.from('jobs').update({ status }).eq('id', id);
    if (error) throw error;
  },
  async getInventory() {
    const { data, error } = await supabase.from('inventory').select('*').order('name');
    if (error) throw error;
    return data;
  },
  async saveInventoryItem(item) {
    const { data, error } = await supabase.from('inventory').upsert({
      id: item.id || undefined,
      name: item.name,
      cost_price: item.costPrice,
      selling_price: item.sellingPrice,
      category: item.category,
      barcode: item.barcode,
      supplier: item.supplier,
    }).select().single();
    if (error) throw error;
    return data;
  },
  async deleteInventoryItem(id) {
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) throw error;
  },
  async getInvoices() {
    const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async saveInvoice(invoice) {
    const { data, error } = await supabase.from('invoices').upsert({
      id: invoice.id || undefined,
      number: invoice.number,
      job_number: invoice.jobNumber,
      client_name: invoice.client,
      phone: invoice.phone,
      date: invoice.date,
      total: invoice.total,
      paid: invoice.paid,
      job_type: invoice.jobType,
      description: invoice.description,
    }).select().single();
    if (error) throw error;
    return data;
  },
  async updateInvoicePaid(id, paid) {
    const { error } = await supabase.from('invoices').update({ paid }).eq('id', id);
    if (error) throw error;
  },
  async getQuotes() {
    const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async saveQuote(quote) {
    const { data, error } = await supabase.from('quotes').upsert({
      id: quote.id || undefined,
      number: quote.number,
      job_number: quote.jobNumber,
      client_name: quote.client,
      phone: quote.phone,
      date: quote.date,
      total: quote.total,
      status: quote.status,
      job_type: quote.jobType,
      description: quote.description,
    }).select().single();
    if (error) throw error;
    return data;
  },
  async updateQuoteStatus(id, status) {
    const { error } = await supabase.from('quotes').update({ status }).eq('id', id);
    if (error) throw error;
  },
};