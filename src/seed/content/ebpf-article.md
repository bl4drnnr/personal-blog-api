Most EDR agents on Linux still hook syscalls from ptrace or an LD_PRELOAD shim, both of which are trivially visible to the process being watched. eBPF moves the observation point into the kernel, which changes both the fidelity of the data and the evasion economics. These are working notes from running an eBPF-based detection stack in a small production fleet.

## What you actually get from the kernel

Attaching to tracepoints like `sched_process_exec` and kprobes on `security_file_open` yields events that user-space tampering cannot suppress. The interesting part is correlating them cheaply enough to run everywhere.

```c
SEC("tracepoint/sched/sched_process_exec")
int handle_exec(struct trace_event_raw_sched_process_exec *ctx)
{
    struct event *e = bpf_ringbuf_reserve(&events, sizeof(*e), 0);
    if (!e)
        return 0;
    e->pid = bpf_get_current_pid_tgid() >> 32;
    bpf_get_current_comm(&e->comm, sizeof(e->comm));
    bpf_ringbuf_submit(e, 0);
    return 0;
}
```

The ring buffer drains into a user-space enricher that joins process ancestry and container metadata before anything leaves the host.

## Rules that survived contact with production

Three months in, the rules that still page are the boring ones: `execve` of a shell whose parent is a long-running daemon, outbound connections from processes that historically never spoke to the network, and writes under `/etc/cron.*` by anything that is not a package manager.

> The rule you can explain to an on-call engineer in one sentence is the rule that survives the quarter.

Everything clever — Markov chains over syscall sequences, entropy scoring of argv — produced beautiful dashboards and zero true positives.

## Costs worth knowing

Per-event overhead stayed under 2% CPU on the busiest hosts, but verifier fights are real: a rule pack that loads cleanly on kernel 6.1 can fail on 5.15 with an opaque `R1 invalid mem access`. Pin your minimum kernel and CI-test the load path against it.
