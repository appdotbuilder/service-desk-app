<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\TicketAttachment
 *
 * @property int $id
 * @property int $ticket_id
 * @property string $filename
 * @property string $filepath
 * @property string $mime_type
 * @property int $file_size
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Ticket $ticket
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment query()
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment whereFilename($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment whereFilepath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment whereFileSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment whereMimeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment whereTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TicketAttachment whereUpdatedAt($value)
 * @method static \Database\Factories\TicketAttachmentFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class TicketAttachment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ticket_id',
        'filename',
        'filepath',
        'mime_type',
        'file_size',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'file_size' => 'integer',
    ];

    /**
     * Get the ticket that owns this attachment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * Get the file size in human readable format.
     *
     * @return string
     */
    public function getHumanFileSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}