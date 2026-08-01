@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
<img src="{{ asset('assets/logos/icon_color_256.webp') }}" alt="" width="38" height="38" class="logo"> {!! $slot !!}
</a>
</td>
</tr>
