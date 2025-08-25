-- Create inquiry_replies table for tracking sent email replies
create table if not exists public.inquiry_replies (
    id uuid default gen_random_uuid() primary key,
    inquiry_id uuid references public.inquiries(id) on delete cascade,
    subject text not null,
    message text not null,
    sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
    sent_to text not null,
    email_id text, -- Email service provider ID for tracking
    status text default 'sent' check (status in ('sent', 'delivered', 'failed', 'bounced')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists inquiry_replies_inquiry_id_idx on public.inquiry_replies(inquiry_id);
create index if not exists inquiry_replies_sent_at_idx on public.inquiry_replies(sent_at);

-- Enable RLS (Row Level Security)
alter table public.inquiry_replies enable row level security;

-- Create policies for inquiry_replies table
create policy "Allow authenticated users to view inquiry replies" on public.inquiry_replies
    for select using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert inquiry replies" on public.inquiry_replies
    for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update inquiry replies" on public.inquiry_replies
    for update using (auth.role() = 'authenticated');
