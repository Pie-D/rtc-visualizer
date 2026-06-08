import Plotly from 'plotly.js-dist'

const fileFormat = 2

function createLegacyCandidateTable (container, stun) {
  // for ice candidates
  const head = document.createElement('tr');
  [
    'Local address',
    'Local type',
    'Local id',
    'Remote address',
    'Remote type',
    'Remote id',
    'Requests sent', 'Responses received',
    'Requests received', 'Responses sent',
    'Active Connection'
  ].forEach((text) => {
    const el = document.createElement('td')
    el.innerText = text
    head.appendChild(el)
  })
  container.appendChild(head)

  for (const t in stun) {
    const row = document.createElement('tr');
    [
      'googLocalAddress', 'googLocalCandidateType', 'localCandidateId',
      'googRemoteAddress', 'googRemoteCandidateType', 'remoteCandidateId',
      'requestsSent', 'responsesReceived',
      'requestsReceived', 'responsesSent',
      'googActiveConnection' /* consentRequestsSent, */
    ].forEach((id) => {
      const el = document.createElement('td')
      el.innerText = stun[t][id]
      row.appendChild(el)
    })
    container.appendChild(row)
  }
}

function createSpecCandidateTable (container, allGroupedStats) {
  const head = document.createElement('tr');
  [
    'Transport id',
    'Candidate pair id',
    'Candidate id',
    '', // local/remote, leave empty
    'type',
    'address',
    'port',
    'protocol',
    'priority / relayProtocol',
    'interface'
  ].forEach((text) => {
    const el = document.createElement('td')
    el.innerText = text
    head.appendChild(el)
  })
  container.appendChild(head)

  const transports = {}
  const pairs = {}
  const candidates = {}

  // massaging the data is different than in fippo's tool
  Object.keys(allGroupedStats).forEach(objectName => {
    const groupedStats = {} // avoid modifying the original object
    Object.keys(allGroupedStats[objectName]).forEach(comp => {
      if (Array.isArray(allGroupedStats[objectName][comp])) {
        const lastIdx = allGroupedStats[objectName][comp].length - 1
        groupedStats[comp] = allGroupedStats[objectName][comp][lastIdx][1]
      } else {
        groupedStats[comp] = allGroupedStats[objectName][comp]
      }
    })
    if (groupedStats.type === 'transport' || objectName.startsWith('RTCTransport')) {
      transports[objectName] = groupedStats
    } else if (groupedStats.type === 'candidate-pair' || objectName.startsWith('RTCIceCandidatePair')) {
      pairs[objectName] = groupedStats
    } else if (['local-candidate', 'remote-candidate'].includes(groupedStats.type) || objectName.startsWith('RTCIceCandidate')) {
      candidates[objectName] = groupedStats
    }
  })

  for (const t in transports) {
    let row = document.createElement('tr')

    let el = document.createElement('td')
    el.innerText = t
    row.appendChild(el)

    el = document.createElement('td')
    el.innerText = transports[t].selectedCandidatePairId
    row.appendChild(el)

    for (let i = 2; i < head.childElementCount; i++) {
      el = document.createElement('td')
      row.appendChild(el)
    }

    container.appendChild(row)

    for (const p in pairs) {
      if (pairs[p].transportId !== t) continue
      const pair = pairs[p]
      row = document.createElement('tr')

      row.appendChild(document.createElement('td'))

      el = document.createElement('td')
      el.innerText = p
      row.appendChild(el)

      container.appendChild(row)
      for (let i = 2; i < head.childElementCount; i++) {
        el = document.createElement('td')
        if (i === 8) {
          el.innerText = pair.priority
        }
        row.appendChild(el)
      }

      for (const c in candidates) {
        if (!(c === pair.localCandidateId || c === pair.remoteCandidateId)) continue
        const candidate = candidates[c]
        row = document.createElement('tr')

        row.appendChild(document.createElement('td'))
        row.appendChild(document.createElement('td'))
        el = document.createElement('td')
        el.innerText = c
        row.appendChild(el)

        el = document.createElement('td')
        el.innerText = candidate.isRemote ? 'remote' : 'local'
        row.appendChild(el)

        el = document.createElement('td')
        el.innerText = candidate.candidateType
        row.appendChild(el)

        el = document.createElement('td')
        el.innerText = candidate.address || candidate.ip
        row.appendChild(el)

        el = document.createElement('td')
        el.innerText = candidate.port
        row.appendChild(el)

        el = document.createElement('td')
        el.innerText = candidate.protocol
        row.appendChild(el)

        el = document.createElement('td')
        el.innerText = candidate.priority
        if (candidate.relayProtocol) {
          el.innerText += ' ' + candidate.relayProtocol
        }
        row.appendChild(el)

        el = document.createElement('td')
        el.innerText = candidate.networkType || 'unknown'
        row.appendChild(el)

        container.appendChild(row)
      }
    }
  }
}

function createContainers (connid, url) {
  let signalingState, iceConnectionState, connectionState, candidates
  const container = document.createElement('details')
  container.open = false
  container.style.margin = '10px'
  let innerText = ''
  let summary = document.createElement('summary')
  if (connid !== 'null') {
    innerText = 'Connection: ' + connid
  } else {
    innerText = 'Meeting events'
  }

  summary.innerText = innerText
  container.appendChild(summary)

  if (connid !== 'null') {
    const statesContainer = document.createElement('div')
    statesContainer.style.display = 'flex'
    statesContainer.style.flexWrap = 'wrap'
    statesContainer.style.gap = '12px'
    statesContainer.style.padding = '16px 20px'
    statesContainer.style.background = 'rgba(255, 255, 255, 0.02)'
    statesContainer.style.borderBottom = '1px solid var(--panel-border)'
    container.appendChild(statesContainer)

    signalingState = document.createElement('div')
    signalingState.id = 'signalingstate_' + connid
    signalingState.textContent = 'Signaling state:'
    signalingState.style.fontSize = '0.85rem'
    signalingState.style.padding = '6px 12px'
    signalingState.style.background = 'rgba(0, 187, 249, 0.1)'
    signalingState.style.color = 'var(--accent-blue)'
    signalingState.style.borderRadius = '6px'
    signalingState.style.border = '1px solid rgba(0, 187, 249, 0.2)'
    statesContainer.appendChild(signalingState)

    iceConnectionState = document.createElement('div')
    iceConnectionState.id = 'iceconnectionstate_' + connid
    iceConnectionState.textContent = 'ICE connection state:'
    iceConnectionState.style.fontSize = '0.85rem'
    iceConnectionState.style.padding = '6px 12px'
    iceConnectionState.style.background = 'rgba(124, 58, 237, 0.1)'
    iceConnectionState.style.color = 'var(--accent-hover)'
    iceConnectionState.style.borderRadius = '6px'
    iceConnectionState.style.border = '1px solid rgba(124, 58, 237, 0.2)'
    statesContainer.appendChild(iceConnectionState)

    connectionState = document.createElement('div')
    connectionState.id = 'connectionstate_' + connid
    connectionState.textContent = 'Connection state:'
    connectionState.style.fontSize = '0.85rem'
    connectionState.style.padding = '6px 12px'
    connectionState.style.background = 'rgba(0, 245, 212, 0.1)'
    connectionState.style.color = 'var(--accent-green)'
    connectionState.style.borderRadius = '6px'
    connectionState.style.border = '1px solid rgba(0, 245, 212, 0.2)'
    statesContainer.appendChild(connectionState)

    candidates = document.createElement('table')
    candidates.className = 'candidatepairtable'
    container.appendChild(candidates)
  }

  const updateLogContainer = document.createElement('details')
  updateLogContainer.open = true
  container.appendChild(updateLogContainer)

  summary = document.createElement('summary')
  summary.innerText = 'PeerConnection updates:'
  updateLogContainer.appendChild(summary)

  const updateLog = document.createElement('table')
  updateLogContainer.appendChild(updateLog)

  const graphs = document.createElement('div')
  container.appendChild(graphs)

  containers[connid] = {
    updateLog,
    iceConnectionState,
    connectionState,
    signalingState,
    candidates,
    graphs
  }

  return container
}

function convertTotalToRateSeries (timeSeries) {
  return timeSeries.reduce(
    (accumulator, currentValue) => {
      const { prevValue } = accumulator
      accumulator.prevValue = currentValue

      if (!prevValue.length) {
        return accumulator
      }

      const [timestamp = 0, totalBytesSent = 0] = currentValue
      const [prevTimestamp = 0, prevTotalBytesSent = 0] = prevValue

      const sampleRateSeconds = (timestamp - prevTimestamp) / 1000
      const bitRate = (totalBytesSent - prevTotalBytesSent) * 8
      const bitRatePerSecond = Math.round(bitRate / sampleRateSeconds)

      accumulator.bitRate.push([timestamp, bitRatePerSecond])
      return accumulator
    },
    { bitRate: [], prevValue: [] }
  ).bitRate
}

function processGUM (data) {
  const container = document.createElement('details')
  container.open = false
  container.style.margin = '10px'

  const summary = document.createElement('summary')
  summary.innerText = 'getUserMedia calls'
  container.appendChild(summary)

  const table = document.createElement('table')
  const head = document.createElement('tr')
  table.appendChild(head)

  const el = document.createElement('th')
  el.innerText = 'getUserMedia'
  head.appendChild(el)

  container.appendChild(table)

  document.getElementById('tables').appendChild(container)
  data.forEach(function (event) {
    processTraceEvent(table, event) // abusing the peerconnection trace event processor...
  })
}

function processTraceEvent (table, event) {
  if (event.type === 'logs') {
    return
  }
  const row = document.createElement('tr')
  let el = document.createElement('td')
  el.setAttribute('nowrap', '')
  el.innerText = event.time?.toISOString() || event.time
  row.appendChild(el)

  // recreate the HTML of webrtc-internals
  const details = document.createElement('details')
  el = document.createElement('summary')
  el.innerText = event.type
  details.appendChild(el)

  el = document.createElement('pre')
  if (['createOfferOnSuccess', 'createAnswerOnSuccess', 'setRemoteDescription', 'setLocalDescription'].indexOf(event.type) !== -1) {
    el.innerText = 'SDP ' + event.value.type + ':' + event.value.sdp
  } else {
    el.innerText = JSON.stringify(event.value, null, ' ')
  }
  details.appendChild(el)

  el = document.createElement('td')
  el.appendChild(details)

  row.appendChild(el)

  // guess what, if the event type contains 'Failure' one could use css to highlight it
  if (event.type.indexOf('Failure') !== -1) {
    row.style.backgroundColor = 'red'
  }

  if (event.type === 'oniceconnectionstatechange') {
    switch (event.value) {
      case 'connected':
      case 'completed':
        row.style.backgroundColor = 'green'
        break
      case 'failed':
        row.style.backgroundColor = 'red'
        break
    }
  } else if (event.type === 'iceConnectionStateChange') {
    // Legacy variant, probably broken by now since the values changed.
    switch (event.value) {
      case 'ICEConnectionStateConnected':
      case 'ICEConnectionStateCompleted':
        row.style.backgroundColor = 'green'
        break
      case 'ICEConnectionStateFailed':
        row.style.backgroundColor = 'red'
        break
    }
  }

  if (event.type === 'onIceCandidate' || event.type === 'addIceCandidate') {
    if (event.value && event.value.candidate) {
      const parts = event.value.candidate.trim().split(' ')
      if (parts && parts.length >= 9 && parts[7] === 'typ') {
        details.classList.add(parts[8])
      }
    }
  }
  table.appendChild(row)
}

const graphs = {}
const containers = {}

function processConnections (connectionIds, data) {
  let stats
  const connid = connectionIds.shift()
  if (!connid) return
  window.setTimeout(processConnections, 0, connectionIds, data)

  let reportname
  const connection = data.peerConnections[connid]
  const container = createContainers(connid, data.url)
  document.getElementById('tables').appendChild(container)

  for (let j = 0; j < connection.length; j++) {
    if (connection[j].type !== 'getStats' && connection[j].type !== 'getstats') {
      processTraceEvent(containers[connid].updateLog, connection[j])
    }
  }

  // then, update the stats displays
  const series = {}
  let connectedOrCompleted = false
  let firstStats
  let lastStats
  for (let i = 0; i < connection.length; i++) {
    if (connection[i].type === 'oniceconnectionstatechange' && (connection[i].value === 'connected' || connection[i].value === 'completed')) {
      connectedOrCompleted = true
    }
    if (connection[i].type === 'getStats' || connection[i].type === 'getstats') {
      const stats = connection[i].value
      Object.keys(stats).forEach(function (id) {
        if (stats[id].type === 'localcandidate' || stats[id].type === 'remotecandidate') return
        Object.keys(stats[id]).forEach(function (name) {
          if (name === 'timestamp') return
          // if (name === 'googMinPlayoutDelayMs') stats[id][name] = parseInt(stats[id][name], 10);
          if (stats[id].type === 'ssrc' && !isNaN(parseFloat(stats[id][name]))) {
            stats[id][name] = parseFloat(stats[id][name])
          }
          if (stats[id].type === 'ssrc' && name === 'ssrc') return // ignore ssrc on ssrc reports.
          if (typeof stats[id][name] === 'number') {
            if (!series[id]) {
              series[id] = {}
              series[id].type = stats[id].type
            }
            if (!series[id][name]) {
              series[id][name] = []
            } else {
              const lastTime = series[id][name][series[id][name].length - 1][0]
              if (lastTime && stats[id].timestamp && stats[id].timestamp - lastTime > 20000) {
                series[id][name].push([stats[id].timestamp || new Date(connection[i].time).getTime(), null])
              }
            }
            if (fileFormat >= 2) {
              series[id][name].push([stats[id].timestamp, stats[id][name]])
            } else {
              series[id][name].push([new Date(connection[i].time).getTime(), stats[id][name]])
            }
          } else if (series[id]) {
            // include plain strings in the object, like the 'transportId' (we use this in the new transports grid)
            series[id][name] = stats[id][name]
          }
        })
      })
    }
    if (connection[i].type === 'getStats' || connection[i].type === 'getstats') {
      if (!firstStats && connectedOrCompleted) firstStats = connection[i].value
      lastStats = connection[i].value
    }
  }

  if (containers[connid].candidates /* we don't show this for the callstats PC (id: null) */) {
    const interestingStats = lastStats // might be last stats which contain more counters
    const stun = []
    if (interestingStats) {
      let t
      for (reportname in interestingStats) {
        if (reportname.indexOf('Conn-') === 0) {
          t = reportname.split('-')
          t = t.join('-')
          stats = interestingStats[reportname]
          stun.push(stats)
        }
      }
    }

    if (Object.keys(stun).length === 0) {
      // spec-stats. A bit more complicated... we need the transport and then the candidate pair and the local/remote candidates.
      createSpecCandidateTable(containers[connid].candidates, series)
    } else {
      createLegacyCandidateTable(containers[connid].candidates, stun)
    }
  }
  const graphTypes = {}
  const graphSelectorContainer = document.createElement('div')
  containers[connid].graphs.appendChild(graphSelectorContainer)

  graphs[connid] = {}

  for (reportname in series) {
    const graphType = series[reportname].type
    graphTypes[graphType] = true

    const container = document.createElement('details')
    container.open = false
    container.classList.add('webrtc-' + graphType)
    containers[connid].graphs.appendChild(container)

    const title = connid + ' type=' + graphType + ' ' + reportname

    const summary = document.createElement('summary')
    summary.innerText = title
    container.appendChild(summary)

    const chartContainer = document.createElement('div')
    chartContainer.id = 'chart_' + Date.now()
    container.appendChild(chartContainer)

    const ignoredSeries = ['type', 'ssrc']
    const visibleSeries = [
      'bytesReceivedInBits/S', 'bytesSentInBits/S',
      'targetBitrate', 'packetsLost', 'jitter',
      'availableOutgoingBitrate', 'roundTripTime'
    ]
    const rateSeriesWhitelist = ['bytesSent', 'bytesReceived']

    // Calculate bitrate per second for time series that contain cumulated values
    // over time, time total bytes sent or total bytes received
    Object.keys(series[reportname])
      .filter(name => rateSeriesWhitelist.includes(name))
      .map(name => {
        const rateSeries = convertTotalToRateSeries(series[reportname][name])
        series[reportname][`${name}InBits/S`] = rateSeries
      })

    const traces = Object.keys(series[reportname])
      .filter(name => !ignoredSeries.includes(name))
      // exclude stats that aren't series like the 'transportId' field that we use this in the new transports grid
      .filter(name => Array.isArray(series[reportname][name]))
      .map(function (name) {
        const data = series[reportname][name]
        return {
          mode: 'lines+markers',
          name: name,
          visible: visibleSeries.includes(name) ? true : 'legendonly',
          x: data.map(d => new Date(d[0])),
          y: data.map(d => d[1])
        }
      })

    const layout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0.15)',
      font: {
        family: 'Plus Jakarta Sans, sans-serif',
        color: '#9ca3af',
        size: 11
      },
      title: {
        text: title,
        font: {
          family: 'Outfit, sans-serif',
          color: '#f3f4f6',
          size: 14,
          weight: 600
        }
      },
      margin: { t: 50, b: 40, l: 60, r: 20 },
      xaxis: {
        gridcolor: 'rgba(255, 255, 255, 0.06)',
        linecolor: 'rgba(255, 255, 255, 0.1)',
        zerolinecolor: 'rgba(255, 255, 255, 0.1)',
        tickcolor: 'rgba(255, 255, 255, 0.2)'
      },
      yaxis: {
        gridcolor: 'rgba(255, 255, 255, 0.06)',
        linecolor: 'rgba(255, 255, 255, 0.1)',
        zerolinecolor: 'rgba(255, 255, 255, 0.1)',
        tickcolor: 'rgba(255, 255, 255, 0.2)'
      },
      hovermode: 'closest',
      showlegend: true,
      legend: {
        bgcolor: 'rgba(0,0,0,0.2)',
        bordercolor: 'rgba(255,255,255,0.08)',
        borderwidth: 1,
        orientation: 'h',
        x: 0,
        y: -0.25
      }
    }

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false
    }

    // expand the graph when opening
    container.ontoggle = () => container.open && Plotly.react(chartContainer, traces, layout, config)
  }

  // Style the graph selector container
  graphSelectorContainer.style.display = 'flex'
  graphSelectorContainer.style.flexWrap = 'wrap'
  graphSelectorContainer.style.gap = '16px'
  graphSelectorContainer.style.marginBottom = '24px'
  graphSelectorContainer.style.padding = '16px 20px'
  graphSelectorContainer.style.background = 'rgba(255, 255, 255, 0.02)'
  graphSelectorContainer.style.border = '1px solid var(--panel-border)'
  graphSelectorContainer.style.borderRadius = '12px'

  Object.keys(graphTypes).forEach(function (type) {
    const wrapper = document.createElement('label')
    wrapper.style.display = 'flex'
    wrapper.style.alignItems = 'center'
    wrapper.style.gap = '8px'
    wrapper.style.cursor = 'pointer'
    wrapper.style.fontSize = '0.9rem'
    wrapper.style.userSelect = 'none'

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = false
    checkbox.style.cursor = 'pointer'
    checkbox.style.width = '16px'
    checkbox.style.height = '16px'
    checkbox.style.accentColor = 'var(--accent-color)'
    wrapper.appendChild(checkbox)

    const text = document.createElement('span')
    text.innerText = 'Toggle graphs for type=' + type
    wrapper.appendChild(text)

    graphSelectorContainer.appendChild(wrapper)

    const selector = '.webrtc-' + type
    checkbox.onchange = function () {
      containers[connid].graphs.querySelectorAll(selector).forEach(function (el) {
        el.open = checkbox.checked
        if (el.open) {
          const chart = el.querySelector('[id^="chart_"]')
          if (chart) {
            Plotly.Plots.resize(chart)
          }
        }
      })
    }
  })
}

export const clearStats = () => {
  const rawContainer = document.getElementById('raw')
  Array.from(rawContainer.children).forEach(el => { el.innerHTML = '' })
}

export const showStats = data => {
  clearStats()
  // TODO Add user agent support document.getElementById('userAgent').innerHTML = `<b>User Agent:</b> <span>${data.userAgent}</span>`
  processGUM(data.getUserMedia)
  window.setTimeout(processConnections, 0, Object.keys(data.peerConnections), data)
}
